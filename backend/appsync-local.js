const { ApolloServer, PubSub } = require("apollo-server");
var { Source } = require("graphql");
const velocity = require("velocityjs");
const yaml = require("js-yaml");
const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs");

const { visit } = require("graphql/language/visitor");
const { parse } = require("graphql/language");

require("dotenv").config();

const options = {
    quiet: false
};
process.argv.forEach(option => {
    if (option === "-q" || option === "--quiet") options.quiet = true;
});

const pubsub = new PubSub();

const CF_SCHEMA = yaml.Schema.create([
    new yaml.Type("!Ref", {
        kind: "scalar",
        construct: function(data) {
            return {
                Ref: data
            };
        }
    }),
    new yaml.Type("!Equals", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::Equals": data
            };
        }
    }),
    new yaml.Type("!Not", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::Not": data
            };
        }
    }),
    new yaml.Type("!Sub", {
        kind: "scalar",
        construct: function(data) {
            return {
                "Fn::Sub": data
            };
        }
    }),
    new yaml.Type("!If", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::If": data
            };
        }
    }),
    new yaml.Type("!Join", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::Join": data
            };
        }
    }),
    new yaml.Type("!Select", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::Select": data
            };
        }
    }),
    new yaml.Type("!FindInMap", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::FindInMap": data
            };
        }
    }),
    new yaml.Type("!GetAtt", {
        kind: "sequence",
        construct: function(data) {
            return {
                "Fn::GetAtt": data
            };
        }
    }),
    new yaml.Type("!GetAZs", {
        kind: "scalar",
        construct: function(data) {
            return {
                "Fn::GetAZs": data
            };
        }
    }),
    new yaml.Type("!Base64", {
        kind: "mapping",
        construct: function(data) {
            return {
                "Fn::Base64": data
            };
        }
    })
]);

//Read GraphQL schema
const typeDefs = fs.readFileSync("../schema.gql", "utf8");
const schemaAST = parse(typeDefs);

//Fill in subscriptions from the Schema
let subscriptions = {
    Query: {},
    Mutation: {}
};
let eventLists = {};
const visitor = {
    enter(node, key, parent, path, ancestors) {
        if (node.kind === "ObjectTypeDefinition" && node.name.value === "Subscription") {
            node.fields.forEach(node => {
                if (node.kind === "FieldDefinition") {
                    const subscriptionName = node.name.value;
                    node.directives.forEach(node => {
                        if (node.name.value === "aws_subscribe") {
                            node.arguments.forEach(node => {
                                let operationType;
                                switch (node.name.value) {
                                    case "queries":
                                        operationType = "Query";
                                        break;
                                    case "mutations":
                                        operationType = "Mutation";
                                        break;
                                }
                                if (operationType) {
                                    node.value.values.forEach(node => {
                                        if (
                                            subscriptions[operationType][node.value] === undefined
                                        ) {
                                            subscriptions[operationType][node.value] = [
                                                subscriptionName
                                            ];
                                        } else {
                                            subscriptions[operationType][node.value].push(
                                                subscriptionName
                                            );
                                        }

                                        const eventName = operationType + "_" + node.value;
                                        if (eventLists[subscriptionName] === undefined) {
                                            eventLists[subscriptionName] = [eventName];
                                        } else {
                                            eventLists[subscriptionName].push(eventName);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
};

visit(schemaAST, visitor);

//Read CloudFront template
const cfTemplate = yaml.load(fs.readFileSync("../template.yml", "utf8"), {
    schema: CF_SCHEMA
});

//Fill in datasources from CF template
let dataSources = {};
Object.keys(cfTemplate.Resources).forEach(name => {
    const R = cfTemplate.Resources[name];
    if (R.Type === "AWS::AppSync::DataSource") {
        const {
            Properties: { LambdaConfig }
        } = R;

        if (LambdaConfig !== undefined) {
            const {
                LambdaFunctionArn: {
                    "Fn::GetAtt": [functionName]
                }
            } = LambdaConfig;

            if (functionName !== undefined) {
                dataSources[name] = functionName;
            }
        }
    }
});

//Fill in resolvers from CF template
let resolvers = {
    Subscription: {},
    Query: {},
    Mutation: {}
};
Object.keys(cfTemplate.Resources).forEach(name => {
    const R = cfTemplate.Resources[name];
    if (R.Type === "AWS::AppSync::Resolver") {
        const {
            Properties: {
                TypeName: typeName,
                FieldName: fieldName,
                DataSourceName: {
                    "Fn::GetAtt": [dataSourceName]
                }
            }
        } = R;

        //resolver mapping template
        let {
            Properties: { RequestMappingTemplate: requestMappingTemplate }
        } = R;
        requestMappingTemplate = requestMappingTemplate.replace(
            /(\$utils\.toJson\()([^()]+)(\))/g,
            "$2"
        );

        if (typeName === "Subscription") {
            resolvers["Subscription"][fieldName] = {
                subscribe: () => {
                    console.log(
                        `Resolver`,
                        chalk.black.bgBlue(fieldName),
                        `executed at ${d.toLocaleTimeString()}`
                    );
                    console.log(`Returned asyncIterator(${eventLists[fieldName]})`);
                    return pubsub.asyncIterator(eventLists[fieldName]);
                }
            };
        } else {
            //local lambda endpoint for the resolver
            let lambdaEndpoint;
            if (dataSources[dataSourceName] !== undefined) {
                lambdaEndpoint = `http://${process.env.LOCAL_LAMBDA_HOST}:${
                    process.env.LOCAL_LAMBDA_PORT
                }/2015-03-31/functions/${dataSources[dataSourceName]}/invocations`;
            } else {
                console.log(
                    chalk.black.bgYellow("WARNING"),
                    `Lambda endpoint is not defined for the ${fieldName} resolver`
                );
            }

            //resolver function
            resolvers[typeName][fieldName] = async (root, args, context) => {
                const d = new Date();
                console.log(
                    `Resolver`,
                    chalk.black.bgBlue(fieldName),
                    `executed at ${d.toLocaleTimeString()}`
                );

                console.log("Rendering velocity template...");
                let template = velocity.render(requestMappingTemplate, {
                    context: {
                        arguments: JSON.stringify(args),
                        request: {
                            headers: JSON.stringify(context.request.headers)
                        },
                        identity: JSON.stringify(context.identity)
                    }
                });
                template = JSON.parse(template);
                const payload = JSON.parse(JSON.stringify(template.payload));

                if (!options.quiet) {
                    const headers = template.payload.headers;
                    if (headers !== undefined && headers !== null) {
                        Object.keys(headers).map(function(key, index) {
                            headers[key] =
                                key === "x-amz-security-token"
                                    ? headers[key].substring(0, 15) + "...[truncated]"
                                    : headers[key];
                        });
                    }
                    console.log("Resulting template:", JSON.stringify(template));
                }

                if (lambdaEndpoint === undefined) {
                    console.log("No endpoint defined, nothing to do..");
                    return;
                }

                console.log("Invoking lambda function with payload...");
                const response = await axios.post(lambdaEndpoint, payload, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                });

                const { data } = response;
                if (data.errorMessage !== undefined) {
                    console.log("Lambda response:", chalk.black.bgRed("ERROR"));
                    console.log("Error: ", JSON.stringify(data));
                    console.log("");
                    throw new Error(data.errorMessage);
                } else {
                    console.log("Lambda response:", chalk.black.bgGreen("DATA"));
                    if (!options.quiet) {
                        console.log("Data: ", JSON.stringify(data));
                    }

                    if (subscriptions[typeName][fieldName] !== undefined) {
                        const eventName = typeName + "_" + fieldName;
                        console.log(
                            `Publishing event "${eventName}" to subscriptions: ${JSON.stringify(
                                subscriptions[typeName][fieldName]
                            )}...`
                        );
                        subscriptions[typeName][fieldName].forEach(subscriptionName =>
                            pubsub.publish(eventName, { [subscriptionName]: data })
                        );
                    }

                    console.log("");
                    return data;
                }
            };
        }
    }
});

//creating and starting Apollo-server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        if (connection) {
            return {};
        } else {
            return {
                request: { headers: req.headers },
                identity: { sourceIp: "127.0.0.1" }
            };
        }
    },
    tracing: true
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(chalk.bold(`Local AppSync ready at ${url}`));
    console.log(chalk.bold(`The subscriptions url is ${subscriptionsUrl}\n`));
});

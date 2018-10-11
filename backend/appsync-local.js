const { ApolloServer } = require("apollo-server");
const velocity = require("velocityjs");
const yaml = require("js-yaml");
const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs");

require("dotenv").config();

const options = {
    quiet: false
};
process.argv.forEach(option => {
    if (option === "-q" || option === "--quiet") options.quiet = true;
});

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
            Properties: {
                LambdaConfig: {
                    LambdaFunctionArn: {
                        "Fn::GetAtt": [functionName]
                    }
                }
            }
        } = R;

        if (functionName !== undefined) {
            dataSources[name] = functionName;
        }
    }
});

//Fill in resolvers from CF template
let resolvers = {
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

        //resolver mapping template
        let {
            Properties: { RequestMappingTemplate: requestMappingTemplate }
        } = R;
        requestMappingTemplate = requestMappingTemplate.replace(
            /(\$utils\.toJson\()([^()]+)(\))/g,
            "$2"
        );

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
                console.log("");
                return data;
            }
        };
    }
});

//creating and starting Apollo-server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        request: { headers: req.headers },
        identity: { sourceIp: "127.0.0.1" }
    })
});

server.listen().then(({ url }) => {
    console.log(chalk.bold(`Local AppSync ready at ${url}\n`));
});

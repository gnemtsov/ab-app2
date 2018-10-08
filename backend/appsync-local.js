const { ApolloServer } = require("apollo-server");
const velocity = require("velocityjs");
const yaml = require("js-yaml");
const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs");

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

//Resolvers
let resolvers = {
	Query: {},
	Mutation: {}
};

//Fill in resolvers from CF template
Object.keys(cfTemplate.Resources).forEach(name => {
	const R = cfTemplate.Resources[name];
	if (R.Type === "AWS::AppSync::Resolver") {
		const typeName = R.Properties.TypeName;
		const resolverName = R.Properties.FieldName;
		let requestTemplate = R.Properties.RequestMappingTemplate;
		requestTemplate = requestTemplate.replace(/(\$utils\.toJson\()([^()]+)(\))/g, "$2");

		resolvers[typeName][resolverName] = async (root, args, context) => {
			const lz = time => `0${time}`.slice(-2);
			const date = new Date();
			const currentTime = `${lz(date.getHours())}:${lz(date.getMinutes())}:${lz(date.getSeconds())}`;
			console.log(chalk.black.bgYellow(`${resolverName} resolver executed at ${currentTime}`));

			console.log('Rendering velocity template...');
			let template = velocity.render(requestTemplate, {
				context: {
					request: { headers: JSON.stringify({ Authorization: context.auth }) },
					arguments: JSON.stringify(args),
					identity: JSON.stringify({ sourceIp: context.ip })
				}
			});
			template = JSON.parse(template);

			const payload = template.payload;
			console.log("Payload:", JSON.stringify(payload));

			console.log("Invoking lambda function...");
			const response = await axios.post(
				`http://127.0.0.1:3001/2015-03-31/functions/ABLambdaRouter/invocations`,
				payload,
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					}
				}
			);

			const { data } = response;
			//console.log(data);
			if (data.errorMessage !== undefined) {
				console.log(chalk.black.bgRed("Received error from lambda"));
				console.log("Error: ", JSON.stringify(data.errorMessage), "\n");
				throw new Error(data.errorMessage);
			} else {
				console.log(chalk.black.bgGreen("Received response from lambda"));
				console.log("Data: ", JSON.stringify(data), "\n");
				return data;
			}
		};
	}
});

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({
		ip: "127.0.0.1",
		auth: req.headers.authorization
	})
});

server.listen().then(({ url }) => {
	console.log(chalk.bold(`Local appsync ready at ${url}\n`));
});

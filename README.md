# AB-APP2
AB-APP2 is an AWS serverless boilerplate application. It is written in JavaScript (React) and Node.js. It uses GraphQL, AWS AppSync, and AWS Lambda. It can be a starting point for your own applications.

If you don't need real-time and offline functionality have a look at [AB-APP](https://github.com/gnemtsov/ab-app) (this is the API Gateway version of the same boilerplate).

This boilerplate application is an app of the fictional "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "[Monday Begins on Saturday](https://en.wikipedia.org/wiki/Monday_Begins_on_Saturday)". AB-APP2 exposes a list of institute's departments for authenticated users. It allows adding and editting departments.

You can see AB-APP2 in action [here](http://aws-codestar-eu-west-1-556321430524-ab-app2-app.s3-website-eu-west-1.amazonaws.com/). Current version is deployed without AWS CloudFront for simplicity, but when running a production app, consider using CloudFront to speed up. Also note that when visiting the link for the first time, application may load slowly. This is because of the lambda cold start. In production warm up dump requests should be used to keep your lambda in a warm state.

# Table of contents
- [Current status](https://github.com/gnemtsov/ab-app2#current-status)
- [Architecture](https://github.com/gnemtsov/ab-app2#architecture)
- [Features implemented](https://github.com/gnemtsov/ab-app2#features-implemented)
- [Local development](https://github.com/gnemtsov/ab-app2#local-development)
    - [Setup local environment](https://github.com/gnemtsov/ab-app2#setup-local-environment)
    - [Local AppSync](https://github.com/gnemtsov/ab-app2#local-appsync)
    - [How to start AB-APP2 locally](https://github.com/gnemtsov/ab-app2#how-to-start-ab-app2-locally)
- [Authorization](https://github.com/gnemtsov/ab-app2#authorization)
- Real-time data
- PWA and offline
- Testing
- Deployment
- Bit
- [TODO](https://github.com/gnemtsov/ab-app2#todo)
- [How to contribute](https://github.com/gnemtsov/ab-app2#how-to-contribute)




# Current status
AB-APP2 is still under development. **It is not finished**! 

Feel free to experiment with it, but don't use it in production as is!

# Architecture

![AB-APP2 architecture](architecture-Main-AppSync.png)

The application uses RDS/DynamoDB and S3 for persistent storage. A single lambda function holds all the backend logic. AWS AppSync is used to connect frontend with backend.

The application has two main folders: **backend** and **frontend**. These folders hold source code of the backend and the frontend respectively.

# Features implemented
- Authorization and authentication using **JWT tokens** + tokens refresh
- [Tables](TABLES.md) for viewing data with pagination, row selection, sorting and CSV export
- [Forms](FORMS.md) for adding and editing data with live, backend-frontend consistent validation.

# Local development

## Setup local environment
1. Install a database (MariaDB), Node.js, NPM, docker, [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone or download the project's source
3. Run `npm install` both in the frontend and backend folders
4. Import mysql.dump.sql into your MariaDB instance
5. Create `backend/.env` file with the following content (replace DB_HOST with IP of your local DB instance):
```
#Environment
PROD=false

#Token secret
SECRET="SOME_SECRET_CODE_672967256"

#DB
DB_HOST="XXX.XXX.XXX.XXX"
DB_NAME="abapp"
DB_USER="abapp"
DB_PASSWORD="abapp"
```
6. Create `frontend/.env` file with the following content
```
REACT_APP_LOCAL_APPSYNC_URL=http://localhost:4000
```

## Local AppSync
For now [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) doesn't support AppSync (see [#551](https://github.com/awslabs/aws-sam-cli/issues/551)). So we've built a Node.js script, which works like local AppSync ([appsync-local.js](https://github.com/gnemtsov/ab-app2/blob/master/backend/appsync-local.js)). This script uses [JS-YAML](https://github.com/nodeca/js-yaml) and [Velocityjs](https://github.com/shepherdwind/velocity.js) to read definitions and velocity mapping templates from the project's CloudFormation template and GraphQL Schema. Then it creates [Apollo Server](https://github.com/apollographql/apollo-server),  to resolve GraphQL queries and mutations, and call local Lambda enpoint. 

Subscriptions are not fully supported yet, but we are working on that.

## How to start AB-APP2 locally
1. Run docker and then run `sam local start-lambda` in the root folder of the project to start local Lambda (set --docker-volume-basedir parameter to your root dir, if you use remote docker)
2. Run `npm start` in the backend folder to start local AppSync. 
3. Run `npm start` in the frontend folder to start webpack development server
4. Have fun! :smiley:

# Authorization
AB-APP2 AppSync client is authorized using AWS_IAM auth type. But this first auth layer simply allows access to AppSync API for all anonymous users. It is handled by AWS Cognito federated identity pool with enabled unauthenticated access.

Actual authorization of AB-APP2 users is based on JWT tokens. Bearer token is passed along side with cognito tokens in `x-app-token` header with every request. All auth logic is handled by the backend Lambda code.

# TODO
- DynamoDB support
- Subscriptions and Real-Time features
- PWA features and offline functionality

# How to contribute
1. Click the "Fork" button.
2. Clone your fork to your local machine:
```shell
git clone https://github.com/YOUR_USERNAME/ab-app.git
```
3. Add 'upstream' repo to keep your form up to date:
```shell
git remote add upstream https://github.com/gnemtsov/ab-app2.git
```
4. Fetch latest upstream changes:
```shell
git fetch upstream
```
5. Checkout your master branch and merge the upstream repo's master branch:
```shell
git checkout master
git merge upstream/master
```
6. Create a new branch and start working on it:
```shell
git checkout -b NEW_FEATURE
```
7. Push your changes to GitHub.
8. Go to your fork's GitHub page and click the pull request button.

### Further reading
* [How to contribute to a project on Github](https://gist.github.com/MarcDiethelm/7303312)
* [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)
* [Fork A Repo - User Documentation](https://help.github.com/articles/fork-a-repo/)
* [Development workflow with Git: Fork, Branching, Commits, and Pull Request](https://github.com/sevntu-checkstyle/sevntu.checkstyle/wiki/Development-workflow-with-Git:-Fork,-Branching,-Commits,-and-Pull-Request)


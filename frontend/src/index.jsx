import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import AWS from "aws-sdk";

import { AWSAppSyncClient, createAppSyncLink } from "aws-appsync";
import { ApolloLink } from "apollo-link";
//import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";

import { Rehydrated } from "aws-appsync-react";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { ApolloProvider, ApolloConsumer } from "react-apollo";

const authLink = setContext((request, previousContext) => {
    let tokens = localStorage.getItem("tokens");
    if (tokens !== null) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        return {
            headers: {
                "x-app-token": "Bearer " + tokens.accessToken
            }
        };
    } else {
        return previousContext;
    }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

AWS.config.update({ region: "eu-west-1" });
//const resultsFetcherLink = new HttpLink({ uri: "http://52.17.94.253:4000/graphql" });

const appSyncLink = createAppSyncLink({
    url:
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_LOCAL_APPSYNC_URL
            : "https://vipqqwuxvfdn7gaos7u4aav3su.appsync-api.eu-west-1.amazonaws.com/graphql",
    region: "eu-west-1",
    auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "eu-west-1:dffe4e03-9e89-4118-911f-ee327e257d9f"
        })
    }
    //resultsFetcherLink
});

const link = ApolloLink.from([authLink, errorLink, appSyncLink]);

const client = new AWSAppSyncClient({ disableOffline: true }, { link });

const app = (
    <ApolloProvider client={client}>
        <Rehydrated>
            <BrowserRouter>
                <ApolloConsumer>{client => <App client={client} />}</ApolloConsumer>
            </BrowserRouter>
        </Rehydrated>
    </ApolloProvider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();

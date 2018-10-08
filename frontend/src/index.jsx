import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import departmentReducer from "./store/reducers/department";
import authReducer from "./store/reducers/auth";
import { watchAuth, watchDepartments } from "./store/sagas";

import axios from "axios";

import AWS from "aws-sdk";

import { AWSAppSyncClient, appSyncConfig, createAppSyncLink } from "aws-appsync";
import { ApolloLink } from 'apollo-link';
import { setContext } from "apollo-link-context";
import { onError } from 'apollo-link-error';

import { Rehydrated } from "aws-appsync-react";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { ApolloProvider, ApolloConsumer } from "react-apollo";

const authLink = setContext((request, previousContext) => {
	let tokens = localStorage.getItem("tokens");
	if (tokens !== null) {
		const tokens = JSON.parse(localStorage.getItem("tokens"));
		return {
			headers: {
				'Authorization': "Bearer " + tokens.accessToken
			}
		}
	}
	else {
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

AWS.config.update({region: 'eu-west-1'});
const appSyncLink = createAppSyncLink({
	url: process.env.NODE_ENV === "development" ?
		process.env.REACT_APP_LOCAL_APPSYNC_URL : "https://vipqqwuxvfdn7gaos7u4aav3su.appsync-api.eu-west-1.amazonaws.com/graphql",
	region: "eu-west-1",
	auth: {
		type: AUTH_TYPE.AWS_IAM,
		credentials: new AWS.CognitoIdentityCredentials({
			IdentityPoolId: "eu-west-1:dffe4e03-9e89-4118-911f-ee327e257d9f"
		})
	}
});

const link = ApolloLink.from([
	authLink,
	errorLink,
	appSyncLink
]);

const client = new AWSAppSyncClient({ disableOffline: true }, { link });

axios.defaults.baseURL =
	process.env.NODE_ENV === "development" ?
	"http://127.0.0.1:3000" :
	"https://kg0mslaalb.execute-api.eu-west-1.amazonaws.com/prod";

const composeEnhancers =
	process.env.NODE_ENV === "development" ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
	departments: departmentReducer,
	auth: authReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchDepartments);

const app = (
	<ApolloProvider client={client}>
		<Rehydrated>
			<Provider store={store}>
				<BrowserRouter>
					<ApolloConsumer>{client => <App client={client} />}</ApolloConsumer>
				</BrowserRouter>
			</Provider>
		</Rehydrated>
	</ApolloProvider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();

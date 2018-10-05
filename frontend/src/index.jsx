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

import { AWSAppSyncClient, appSyncConfig } from "aws-appsync";

import { Rehydrated } from "aws-appsync-react";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { ApolloProvider, ApolloConsumer } from "react-apollo";

const client = new AWSAppSyncClient({
	url:
		process.env.NODE_ENV === "development"
			? process.env.REACT_APP_LOCAL_APPSYNC_URL
			: "https://ds3mhssz6zfmvemnkkmp5qyu6q.appsync-api.eu-west-1.amazonaws.com/graphql",
	region: "eu-west-1",
	auth: {
		type: AUTH_TYPE.OPENID_CONNECT,
		jwtToken: () => {
			const tokens = JSON.parse(localStorage.getItem("tokens"));
			return tokens === null ? null : "Bearer " + tokens.accessToken;
		}
	},
	disableOffline: true
});

axios.defaults.baseURL =
	process.env.NODE_ENV === "development"
		? "http://127.0.0.1:3000"
		: "https://kg0mslaalb.execute-api.eu-west-1.amazonaws.com/prod";

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

import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

import gql from "graphql-tag";

import Layout from "./hoc/Layout/Layout";
import Departments from "./pages/Departments/Departments";
import Login from "./pages/Login/Login";

import classes from "./App.css";

const asyncAdd = asyncComponent(() => {
	return import("./pages/Add/Add");
});

const asyncEdit = asyncComponent(() => {
	return import("./pages/Edit/Edit");
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { isAuth: false };
	}

	componentDidMount() {
		console.log("App.componentDidMount: refreshing, then authenticating..");
		this.refreshToken().then(result => {
			if (result) {
				console.log("App.componentDidMount: the user is authenticated");
				this.setState({ isAuth: true });
				this.refreshTimerID = setInterval(this.refreshToken, 50 * 60 * 1000);
			} else {
				console.log("App.componentDidMount: the user is not authenticated");
			}
		});
	}

	componentWillUnmount() {
		clearInterval(this.refreshTimerID);
	}

	refreshToken = () => {
		const tokens = JSON.parse(localStorage.getItem("tokens"));
		if (tokens !== null) {
			let base64Url = tokens.accessToken.split(".")[1];
			const base64 = base64Url.replace("-", "+").replace("_", "/");
			const tokenData = JSON.parse(atob(base64));
			const currentTimestamp = Math.floor(Date.now() / 1000);
			if (currentTimestamp > tokenData.exp) {
				console.log("App.refreshToken: access token expired, trying to refresh..");

				const TOKEN_QUERY = gql`
					mutation($sub: String!, $refreshToken: String!) {
						token(sub: $sub, refreshToken: $refreshToken) {
							accessToken
							refreshToken
						}
					}
				`;

				return this.props.client
					.mutate({
						mutation: TOKEN_QUERY,
						variables: { sub: tokenData.sub, refreshToken: tokens.refreshToken }
					})
					.then(response => {
						console.log(`App.refreshToken: access token refreshed, tokens in localStorage updated`);
						localStorage.setItem("tokens", JSON.stringify(response.data.token));
						return true;
					})
					.catch(error => {
						console.log("App.refreshToken: error while refreshing tokens.", error);
					});
			}
			console.log("App.refreshToken: access token not expired, nothing to do.");
			return Promise.resolve(true);
		}
		console.log("App.refreshToken: no tokens found in localStorage.");
		return Promise.resolve(false);
	};

	login = tokens => {
		console.log("App.login: logging in..");
		localStorage.setItem("tokens", JSON.stringify(tokens));
		this.setState({ isAuth: true });
	};

	logout = () => {
		console.log("App.logout: logging out...");
		localStorage.removeItem("tokens");
		this.setState({ isAuth: false });
	};

	render() {
		let routes = (
			<Switch>
				<Route path="/login" component={() => <Login isAuth={this.state.isAuth} login={this.login} />} />
				<Route
					path="/add"
					render={() => <p className={classes.UnAuthMessage}>Please, authenticate to add departments.</p>}
				/>
				<Route
					path="/edit"
					render={() => <p className={classes.UnAuthMessage}>Please, authenticate to edit departments.</p>}
				/>
				<Route
					path="/"
					exact
					render={() => (
						<p className={classes.UnAuthMessage}>Please, authenticate to see departments list.</p>
					)}
				/>
				<Redirect to="/" />
			</Switch>
		);

		if (this.state.isAuth) {
			routes = (
				<Switch>
					<Route
						path="/logout"
						component={() => {
							this.logout();
							return <Redirect to="/" />;
						}}
					/>
					<Route path="/add" component={asyncAdd} />
					<Route path="/edit" component={asyncEdit} />
					<Route path="/" exact component={Departments} />
					<Redirect to="/" />
				</Switch>
			);
		}

		return <Layout isAuth={this.state.isAuth}>{routes}</Layout>;
	}
}

export default withRouter(App);

import React from "react";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";

import Form from "../../components/Form/Form";

const Login = props => {
	const authRedirect = props.isAuth ? <Redirect to="/" /> : null;

	const LOGIN = gql`
		mutation($u_login: String!, $u_password: String!) {
			login(u_login: $u_login, u_password: $u_password) {
				accessToken
				refreshToken
			}
		}
	`;

	return (
		<div>
			{authRedirect}
			<Form
				formTitle="Please, authenticate"
				formName="login"
				buttonText={["Login", "Logging in.."]}
				outputObjectName="login"
				mutation={LOGIN}
				submitHandler={response => props.login(response.data.login)}
			/>
		</div>
	);
};

export default Login;

import React from "react";
import { Redirect } from "react-router-dom";

import Form from "../../components/Form/Form";

import MUTATION_LOGIN from "../../graphql/mutations/login";

const Login = props => {
    const authRedirect = props.isAuth ? <Redirect to="/" /> : null;

    return (
        <div>
            {authRedirect}
            <Form
                formTitle="Please, authenticate"
                formName="login"
                buttonText={["Login", "Logging in.."]}
                outputObjectName="login"
                mutation={MUTATION_LOGIN}
                submitHandler={response => props.login(response.data.login)}
            />
        </div>
    );
};

export default Login;

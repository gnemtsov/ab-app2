import gql from "graphql-tag";

export default gql`
    mutation($u_login: String!, $u_password: String!) {
        login(u_login: $u_login, u_password: $u_password) {
            accessToken
            refreshToken
        }
    }
`;

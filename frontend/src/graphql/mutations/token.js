import gql from "graphql-tag";

export default gql`
    mutation($sub: String!, $refreshToken: String!) {
        token(sub: $sub, refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`;

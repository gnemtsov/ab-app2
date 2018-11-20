import gql from "graphql-tag";

export default gql`
    mutation($departmentId: ID!) {
        remove(departmentId: $departmentId) {
            d_id
        }
    }
`;
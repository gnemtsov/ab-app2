import gql from "graphql-tag";

export default gql`
    subscription {
        newEdit {
            d_id
            d_title
        }
    }
`;

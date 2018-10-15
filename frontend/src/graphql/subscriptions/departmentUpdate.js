import gql from "graphql-tag";

export default gql`
    subscription df {
        newEdit {
            d_id
            d_title
            d_head
            d_size
            d_created
        }
    }
`;

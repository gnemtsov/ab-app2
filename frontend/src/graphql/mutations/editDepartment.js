import gql from "graphql-tag";

export default gql`
    mutation($department: DepartmentInput!) {
        edit(department: $department) {
            d_id
            d_title
            d_head
            d_size
            d_created
        }
    }
`;

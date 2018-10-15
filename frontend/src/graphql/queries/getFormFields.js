import gql from "graphql-tag";

export default gql`
    query($formName: String!, $dataId: Int) {
        getForm(formName: $formName, dataId: $dataId) {
            name
            label
            type
            value
            required
            validators {
                f
                message
                params
            }
        }
    }
`;

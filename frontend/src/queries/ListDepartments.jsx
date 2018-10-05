import gql from "graphql-tag";

export default gql`
	query {
		listDepartments {
			cols {
				name
				title
				defaultContent
				sortOrder
				sortDirection
				frontendFormatter
				html
			}
			rows {
				d_id
				d_title
				d_head
				d_size
				d_created
			}
		}
	}
`;

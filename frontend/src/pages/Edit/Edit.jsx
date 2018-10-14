import React from "react";
import Form from "../../components/Form/Form";
import gql from "graphql-tag";
import classes from "./Edit.css";
import Utils from "../../utils.js";

const Edit = props => {
	const queryParams = Utils.queryParamsToObj(props.location.search);

	const EDIT_DEPARTMENT = gql`
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
	return (
		<div className={classes.FormContainer}>
			<Form
				formTitle="Edit department"
				buttonText={["Save", "Saving.."]}
				doneText={"Saved!"}
				formName="department"
				dataId={Number(queryParams.d_id)}
				inputObjectName="department"
				outputObjectName="edit"
				mutation={EDIT_DEPARTMENT}
			/>
		</div>
	);
};

export default Edit;

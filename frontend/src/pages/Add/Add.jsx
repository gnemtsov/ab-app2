import React from "react";
import Form from "../../components/Form/Form";
import gql from "graphql-tag";
import classes from "./Add.css";

const Add = () => {
	const ADD_DEPARTMENT = gql`
		mutation($department: DepartmentInput!) {
			add(department: $department) {
				name
				message
			}
		}
	`;
	return (
		<div className={classes.FormContainer}>
			<Form
				formTitle="New department"
				buttonText={["Add", "Adding.."]}
				doneText={"Department was added!"}
				formName="department"
				dataId={0}
				inputObjectName="department"
				outputObjectName="add"
				mutation={ADD_DEPARTMENT}
			/>
		</div>
	);
};

export default Add;

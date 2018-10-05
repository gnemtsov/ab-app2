import React, { Component } from "react";

import Spinner from "../../components/UI/Spinner/Spinner";
import Table from "../../containers/Table/Table";

import classes from "./Departments.css";

import { graphql, compose } from "react-apollo";

import ListDepartmentsQuery from "../../queries/ListDepartments";

export class Departments extends Component {
	render() {
		let departments = <Spinner />;
		const { listDepartments: data, error } = this.props.data;

		if (error) {
			throw error;
		} else if (data) {
			departments = (
				<Table
					title="Departments"
					emptyTableMessage="No departments found"
					{...this.props.data.listDepartments}
				/>
			);
		}

		return <div className={classes.TableContainer}>{departments}</div>;
	}
}

const gqlListDepartments = graphql(ListDepartmentsQuery);

export default compose(gqlListDepartments)(Departments);

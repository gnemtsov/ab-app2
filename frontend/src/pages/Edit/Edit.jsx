import React from "react";
import Form from "../../components/Form/Form";
import classes from "./Edit.css";
import Utils from "../../utils.js";

import MUTATION_EDIT_DEPARTMENT from "../../graphql/mutations/editDepartment";
import QUERY_LIST_DEPARTMENTS from "../../graphql/queries/listDepartments";

const Edit = props => {
    const queryParams = Utils.queryParamsToObj(props.location.search);

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
                mutation={MUTATION_EDIT_DEPARTMENT}
                refetchQueries={[{ query: QUERY_LIST_DEPARTMENTS }]}
            />
        </div>
    );
};

export default Edit;

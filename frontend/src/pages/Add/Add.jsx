import React from "react";
import Form from "../../components/Form/Form";
import classes from "./Add.css";

import MUTATION_ADD_DEPARTMENT from "../../graphql/mutations/addDepartment";
import QUERY_LIST_DEPARTMENTS from "../../graphql/queries/listDepartments";

const Add = () => {
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
                mutation={MUTATION_ADD_DEPARTMENT}
                refetchQueries={[{ query: QUERY_LIST_DEPARTMENTS }]}
            />
        </div>
    );
};

export default Add;

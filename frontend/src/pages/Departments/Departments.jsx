import React, { Component } from "react";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

import Spinner from "../../components/UI/Spinner/Spinner";
import Table from "../../components/Table/Table";
import classes from "./Departments.css";

import MUTATION_REMOVE_DEPARTMENT from "../../graphql/mutations/removeDepartment";
import QUERY_LIST_DEPARTMENTS from "../../graphql/queries/listDepartments";
import SUBSCRIPTION_DEPARTMENT_UPDATE from "../../graphql/subscriptions/departmentUpdate";

class Departments extends Component {
    constructor(props) {
        super(props);
        
        this.gqlClient = this.props.client;
        
        this.handleRemove = this.handleRemove.bind(this);
    }
    
    handleRemove(row) {
        const variables = {
            departmentId: row.d_id
        };
        
        console.log(variables);
        
        this.gqlClient
            .mutate({
                mutation: MUTATION_REMOVE_DEPARTMENT,
                variables,
                refetchQueries: [{query: QUERY_LIST_DEPARTMENTS}]
            });
    }
    
    render() {
        return (
            <Query query={QUERY_LIST_DEPARTMENTS}>
                {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <Spinner />;
                    if (error) throw error;
        
                    return (
                        <div className={classes.TableContainer}>
                            <Table
                                title="Departments"
                                selectable={true}
                                emptyTableMessage="No departments found"
                                {...data.listDepartments}
                                subscribeToUpdates={() =>
                                    subscribeToMore({
                                        document: SUBSCRIPTION_DEPARTMENT_UPDATE,
                                        updateQuery: (prev, { subscriptionData }) => {
                                            console.log(prev, subscriptionData);
                                            return prev;
        
                                            //if (!subscriptionData.data) return prev;
                                            //const newEdit = subscriptionData.data.newEdit;
                                            // const i = prev.fields.findIndex(field => fieldName === field.name);
                                            /* return Object.assign({}, prev, {
                                            entry: {
                                              comments: [newFeedItem, ...prev.entry.comments]
                                            }*/
                                        }
                                    })
                                }
                                onRemove={this.handleRemove}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(Departments);
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

import ErrorBoundary from "../../hoc/errorBoundary/errorBoundary";
import Spinner from "../../components/UI/Spinner/Spinner";
import Icon from "../UI/Icon/Icon";
import Button from "../UI/Button/Button";
import FormElement from "./FormElement/FormElement";
import classes from "./Form.css";

class AbForm extends Component {
	static defaultProps = {
		infoIcon: <Icon name="info" width="26" height="26" stroke="#666666" />,
		layout: "Horizontal",
		doneText: "Done!",
		buttonText: ["Submit", "Sending..."],
		dataId: 0,
		className: ""
	};

	static propTypes = {
		infoIcon: PropTypes.node,
		layout: PropTypes.oneOf(["Horizontal", "Inline"]),
		buttonText: PropTypes.array,
		doneText: PropTypes.string,
		className: PropTypes.string,
		formName: PropTypes.string.isRequired,
		dataId: PropTypes.number,
		inputObjectName: PropTypes.string,
		outputObjectName: PropTypes.string.isRequired,
		submitHandler: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.gqlClient = this.props.client;
		this.state = {
			submitted: false,
			status: "loading", //possible options: valid, invalid, loading, sending
			fields: []
		};
	}

	componentDidMount() {
		const GET_FIELDS = gql `
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

		this.gqlClient
			.query({
				query: GET_FIELDS,
				variables: {
					formName: this.props.formName,
					dataId: this.props.dataId
				}
			})
			.then(result => {
				let fields = JSON.parse(JSON.stringify(result.data.getForm));
				fields = fields.map(field => {
					field.value = field.value === null ? "" : field.value;
					field.message = "";

					if (field.validators === null) {
						field.validators = [];
					}
					else {
						field.validators = field.validators.map(validator => {
							let f =
								typeof validator.f === "function" ?
								validator.f : // eslint-disable-next-line no-new-func
								new Function("return " + validator.f)();
							f.params = validator.params || [];
							f.message = validator.message || "";
							if (f.params.length) {
								f.message = f.message.replace(/%([0-9]+)%/g, (...args) => f.params[Number(args[1])]);
							}
							return f;
						});
					}

					return field;
				});

				this.setState({
					status: this.getFieldsValidity(fields),
					fields
				});
			});
	}

	componentWillUnmount() {
		clearTimeout(this.timerId);
	}

	getFieldsValidity = fields => {
		for (const { required, value, message } of fields) {
			if ((required && value === "") || message !== "") {
				return "invalid";
			}
		}
		return "valid";
	};

	inputChangedHandler = (data, name) => {
		const i = this.state.fields.findIndex(field => name === field.name);
		const { type, validators } = this.state.fields[i];

		let value;
		switch (type) {
			case "Boolean":
				value = data.target.checked;
				break;
			case "Date":
				value = data ? data.format("YYYY-MM-DD").toString() : "";
				break;
			default:
				value = data.target.value;
		}

		let message = "";
		for (const f of validators) {
			if (!f(value, ...f.params)) {
				message = f.message;
				break;
			}
		}

		let field = {
			...this.state.fields[i],
			message,
			value
		};

		this.setState((prevState, props) => {
			prevState.fields[i] = field;
			return {
				status: this.getFieldsValidity(prevState.fields),
				fields: prevState.fields
			};
		});
	};

	submitHandler = event => {
		event.preventDefault();

		const sendFormValues = () => {
			const values = {};
			for (const { name, value } of this.state.fields) {
				values[name] = value;
			}

			let variables;
			if (this.props.inputObjectName === undefined) {
				variables = values;
			}
			else {
				variables[this.props.inputObjectName] = values;
			}

			this.gqlClient
				.mutate({
					mutation: this.props.mutation,
					variables
				})
				.then(response => {
					console.log(JSON.stringify(response));
					console.log(this.props.outputObjectName);
					if (this.props.submitHandler) {
						return this.props.submitHandler(response);
					}
					const { name: fieldName, message: fieldMessage } = response.data[this.props.outputObjectName];
					if (fieldMessage === null) {
						//successful form submition
						this.setState(prevState => {
							let fields = prevState.fields;
							if (this.props.dataId === 0) {
								fields = fields.map(field => {
									switch (field.type) {
										case "Boolean":
											field.value = false;
											break;
										default:
											field.value = "";
											break;
									}
									return field;
								});
							}
							return {
								submitted: true,
								status: this.getFieldsValidity(fields),
								fields
							};
						});
						this.timerId = setTimeout(() => this.setState({ submitted: false }), 2000);
					}
					else {
						//server invalidated a form field
						this.setState(prevState => {
							const i = prevState.fields.findIndex(field => fieldName === field.name);
							prevState.fields[i] = {
								...prevState.fields[i],
								message: fieldMessage
							};
							return {
								status: "invalid",
								fields: prevState.fields
							};
						});
					}
				});
		};

		this.setState({ status: "sending" }, sendFormValues);
	};

	render() {
		let form = null;

		if (this.state.status === "loading") {
			form = <Spinner />;
		}
		else {
			//form elements
			let formElements = [];
			for (const field of this.state.fields) {
				let element = (
					<FormElement
						key={field.name}
						id={field.name}
						infoIcon={this.props.infoIcon}
						layout={this.props.layout}
						{...field}
						message={field.message}
						inputChanged={data => this.inputChangedHandler(data, field.name)}
					/>
				);

				if (this.props.layout === "Inline") {
					element = <div className={classes.FormElement}>{element}</div>;
				}

				formElements.push(element);
			}

			//done text classes
			const doneTextClasses = [classes.DoneText];
			if (this.state.submitted) {
				doneTextClasses.push(classes.Visible);
			}

			form = [
				<form
					key="AbForm"
					className={[classes.Form, classes[this.props.layout], this.props.className].join(" ")}
					onSubmit={this.submitHandler}
				>
					{formElements}
					<div key="SubmitButton" className={classes.SubmitButton}>
						<Button type="Submit" disabled={["sending", "invalid"].includes(this.state.status)}>
							{this.state.status === "sending" ? this.props.buttonText[1] : this.props.buttonText[0]}
						</Button>
						<span className={doneTextClasses.join(" ")}>{this.props.doneText}</span>
					</div>
				</form>,
				<ReactTooltip key="ReactTooltip" type="info" place="right" className={classes.Tooltip} />
			];
		}

		return (
			<React.Fragment>
				<h1>{this.props.formTitle}</h1>
				<ErrorBoundary>{form}</ErrorBoundary>
			</React.Fragment>
		);
	}
}

export default withApollo(AbForm);

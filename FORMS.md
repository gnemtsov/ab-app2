# AB-APP2 forms

Writing forms markup, programming fields validation (both frontend and backend) can be hard! AB-APP makes the whole process a breeze. You just provide form data as a simple json config and that's it! :tada:

Implemented features:
- Live validation as user types
- Consistent frontend-backend validation
- Automatic validation according to DB column types
- Clean, responsible mobile-first CSS markup (horizontal or inline)
- Easy custom styling
- Very fast and lightweight, no dependencies

## Architecture

On the backend, there is a corresponding .json file for each form. This file holds fields descriptions. On the frontend, this data goes into fields property of the table component. There is also a .sql file for some forms which holds the query for fetching data for the form fields from a database.

The backend is responsible for building form config and sending it to the frontend. It is also responsible for accepting GraphQL mutations, validating data and putting changes into the database. 

The frontend is responsible for fetching form data from the backend and sending user data back - submission of the form. It also handles client-side validation.

![Forms architecture](architecture-Forms-AppSync.png)

## Validation

Validation is a very important feature.

AB-APP implements realtime validation as user types:
![Live validation](validation.gif)

There is a library of validation functions on the backend. When you configure form fields in the .json file you may put an array of validators functions names which you want to use with this field. 

Some validators will be added in the fields configs implicitly by fetching and parsing the corresponding column types from the database.

All validators functions bodies are stored on the backend and they are passed to the frontend as strings. On the frontend, these functions are recreated using `new Function()` constructor which allows to create functions dynamically.

Validator function accepts field value as the first parameter and then zero or multiple additional parameters to perform validation. It returns true or false, which means whether validation is passed or not.

For example, this validator checks that a string length is not less than **min** and not more than **max**.
```jsx
module.exports.strMinMax = (value, min, max) => value.length >= min && value.length <= max;
```

As user types in the value of an input is passed to all attached validators one by one. If all validators return true, the field is considered valid. If one of the validators returns false (first wins), the field gets invalidated and the validator's message is shown under the input field. The message, as well as additional validator parameters, are stored along with validator function body in the object with validator description (see the description of fields property of the React component).

This logic allows writing validators functions in one place - on the backend, making it the single source of truth. It also allows to apply same validators on the frontend as user types and then on the backend when it receives submitted form. We need to validate data on the backend because we should never trust any data, which is coming from the frontend.

## The React component

The component has the following properties:

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| layout | String ('Horizontal' or 'Inline') | 'Horizontal' | Form layout type |
| infoIcon | HTML or JSX | feather info icon | Here you can put your custom "i" icon - it can be a react component |
| buttonText | String or Array of strings | ["Submit", "Sending..."] | Text for the submit button. If an array is given it must contain two elements: one for default state and one for sending state |
| successText | String | 'Success!' | Text that appears near the submit button if the form was submitted successfully |
| failureText | String | 'Failure!' | Text that appears near the submit button if the form was submitted successfully |
| doneTextDuration | Integer | 2000 | Number of milliseconds to display doneText near the submit button |
| className | String | '' | Name of a custom class (see below) |
| dataId | Number | 0 | A unique ID of a data object from the database (for "Add" form it is 0) |
| submitHandler | Function | null | Function that will be invoked when the form is submitted |
| inputObjectName | String | null | Mutations variables can be sent as object properties. If so this is the name of the object |
| mutation | GraphQL AST | null | GraphQL mutation that updates data |
| refetchQueries | Array of objects | null | GraphQL queries to refetch data after update |

### Styling

Forms can be rendered as horizontal (default, CSS grid is used) or inline (layout="Inline" prop must be set, CSS flex is used). Styles of the form can be overridden by custom className.

You can put a custom class on top of default form styles, so all custom styles will override the default. For example, to make labels green, you should set your custom class: `className = "CustomForm"`. Then write the following CSS in the .css file of your component, where you use react-ab-form:
```css
.CustomForm .Label {
    color: green;
}
```

### Submitting form
Use **submitHandler** property to set a function that will be invoked when the form is submitted. Submit result will be passed to this function as a parameter.

### Form fields

Each form field is an object with the following properties.

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| name | String | none | Field name |
| label | String | '' | Field label |
| placeholder | String | '' | Field placeholder |
| value | String | none | Field value |
| required | Boolean | false | Whether field is required |
| type | Boolean | false | Field type (see below) |
| allowedValues | Array of strings | [] | Contains allowed values for the field (see "type" property description for more details) |
| noEcho | Boolean | false | If set `true`, value of the field is obscured |
| description | String | '' | String with additional field description. If set, small "i" icon appears near the field. When user hovers the icon this description appears as tooltip |
| validators | Array of objects | '' | Contains validators functions descriptions (one or multiple), see below |

#### Field types
Fields can be one of the following types:

| Field type  | Additional conditions | Renders as |
| ------------- | ------------- | ------------- |
| String  | -  | input type="text" |
| String  | noEcho = true  | input type="password" |
| String  | allowedValues is an array of 2 elements  | input type="radio" |
| String  | allowedValues is an array of more than 2 elements  | select |
| Text  | -  | textarea |
| Number  | -  | input type="text" |
| Boolean  | -  | input type="checkbox" |


#### Field validators
Each validator is described by a separate object with the following properties:
- **params**, (array): additional params values, passed to validator besides field value
- **message** (string): message that should be shown when the validator returns false
- **f** (function or function body as a string): validator function, it should return true or false

When a user changes a field all validators are executed one by one with the current value of the field. If the validator returns `false`, execution stops and current validator message is shown - the field is considered invalid.
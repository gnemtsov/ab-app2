# Introduction
AB-APP2 is an AWS serverless boilerplate application, using GraphQL and AWS AppSync. It can be a starting point for your own applications.

AB-APP2 is an app of the fictional "Scientific Research Institute of Sorcery and Wizardry" from the famous novel by Boris and Arkady Strugatsky "[Monday Begins on Saturday](https://en.wikipedia.org/wiki/Monday_Begins_on_Saturday)". AB-APP2 exposes a list of institute's departments for authenticated users. It allows to add and edit departments.

AB-APP2 is deployed [here](http://aws-codestar-eu-west-1-556321430524-ab-app2-app.s3-website-eu-west-1.amazonaws.com/). Note that when visiting the link for the first time, application may load slowly. This is because of the lambda cold start. In production warm up dump requests should be used to keep your lambda in a warm state.

## Application status
AB-APP2 is still under development. **It is not finished**! So feel free to experiment with it, but don't use it in production as is.

## Architecture

![AB-APP2 architecture](architecture-Main-AppSync.png)

The application uses RDS/DynamoDB and S3 for persistent storage. A single lambda function holds all the backend logic. AWS AppSync is used to connect the frontend and the backend.

The application has two main folders: **backend** and **frontend**. Backend folder contains backend code and frontend folder contains static content (frontend code, assets, etc.) 

AB-APP2 backend is written in Node.js. AB-APP2 frontend is written with React and AppSync client.

## Features implemented
Authentication using **JWT tokens** + tokens refresh.

**Tables** for viewing data with pagination, row selection, sorting and CSV export.

**Forms** for adding and editing data with live, backend-frontend consistent validation.

## TODO
- Add DynamoDB support
- Add real-time features
- Add PWA features and offline functionality

# Table of contents
- [Local development](https://github.com/gnemtsov/ab-app2#local-development)
    - [Setup environment](https://github.com/gnemtsov/ab-app2#setup-environment)
    - [Local AppSync](https://github.com/gnemtsov/ab-app2#local-appsync)
    - [Start AB-APP2 locally](https://github.com/gnemtsov/ab-app2#start-ab-app2-locally)
- Authentication and authorization
- [Tables](https://github.com/gnemtsov/ab-app2#tables)
    - [Architecture](https://github.com/gnemtsov/ab-app2#architecture-1)
    - [Formatters functions](https://github.com/gnemtsov/ab-app2#formatters-functions)
    - [Core table component](https://github.com/gnemtsov/ab-app2#core-table-component)
- [Forms](https://github.com/gnemtsov/ab-app2#forms)
    - [Architecture](https://github.com/gnemtsov/ab-app2#architecture-2)
    - [Validation](https://github.com/gnemtsov/ab-app2#validation)
    - [Core form component](https://github.com/gnemtsov/ab-app2#core-form-component)
- PWA and offline
- Real-time data
- Testing
- Deployment
- Bit
- [How to contribute](https://github.com/gnemtsov/ab-app2#how-to-contribute)


# Setup environment
1. Install a database (MariaDB), Node.js, NPM, docker, [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Git clone or download the project's source
3. Run `npm install` both in the frontend and backend folders
4. Import mysql.dump.sql into your MariaDB instance
5. Create `backend/.env` file with the following content (replace DB_HOST with IP of your local DB instance):
```
#Environment
PROD=false

#Token secret
SECRET="SOME_SECRET_CODE_672967256"

#DB
DB_HOST="XXX.XXX.XXX.XXX"
DB_NAME="abapp"
DB_USER="abapp"
DB_PASSWORD="abapp"
```
6. Create `frontend/.env` file with the following content
```
REACT_APP_LOCAL_APPSYNC_URL=http://localhost:4000
```

# Local AppSync
For now [aws-sam-cli](https://github.com/awslabs/aws-sam-cli) doesn't support AppSync (see [#551](https://github.com/awslabs/aws-sam-cli/issues/551)). So we've built a Node.js script, which works like local AppSync ([appsync-local.js](https://github.com/gnemtsov/ab-app2/blob/master/backend/appsync-local.js)). This script uses [JS-YAML](https://github.com/nodeca/js-yaml) and [Velocityjs](https://github.com/shepherdwind/velocity.js) to read definitions and velocity mapping templates from the CloudFormation template and GraphQL Schema. Then it creates [Apollo Server](https://github.com/apollographql/apollo-server),  to resolve GraphQL queries and mutations, and call local Lambda enpoint. 

Subscriptions are not fully supported yet, but we are working on that.

# Start AB-APP2 locally
1. Run docker and then run `sam local start-lambda` in the root folder of the project to start local Lambda (set --docker-volume-basedir parameter to your root dir, if you use remote docker)
2. Run `npm start` in the backend folder to start local AppSync. 
3. Run `npm start` in the frontend folder to start webpack development server
4. Have fun! :smiley:


# Tables

Tables are the best way to present data to the users of your application. AB-APP2 table implementation includes backend and frontend logic. 

Implemented features:
- Pagination
- Sorting (hold shift for multisort) 
- Row selection (hold ctrl or shift to select multiple rows)
- CSV data export
- Sticky table toolbar
- Easy custom styling
- Very fast and lightweight, no dependencies

## Architecture

On the backend, there is a corresponding .sql file for each application table. This file contains a query that is executed to fetch table data from a database. Column descriptions are also stored on the backend. They are stored as .json files as array of objects. These descriptions go to `cols` property of the table React component (see below).

The backend is responsible for fetching table data from a database, applying backend "formatters" (see below) and providing column descriptions. 

The frontend is responsible for rendering tables. It has two React components: a high order table component (HOC) and a core table component. The core table component can be used outside AB-APP as an independent React component. 

HOC is responsible for fetching table data from the backend and applying frontend formatters. The core component is responsible for rendering and providing main table functionality (selecting, sorting, pagination, etc.)

![Tables architecture](architecture-Tables-AppSync.png)

## Formatters functions
Formatter function is a function that accepts column description and raw table data of the current row and returns the rendered content of table cell. There are backend and frontend libs of formatters functions.

Example:
```jsx
const sampleFormatter = (col, row) => `<b>${row.lastname}${row.firstname}</b>`;
```

Formatters are defined for a column and they are executed for each table cell in a column. There can only be one formatter per column. 

Since formatter function is executed for each cell, it slows down table creation and/or rendering. If possible you should try not to use formatters at all - try to get table data as it should be displayed right from a database. 

If you need to use a formatter, try to use frontend formatter. It is executed on the frontend and only for whose column cells that are currently rendered on a page.

Use backend formatters only if there are no other options. Backend formatters are executed on the backend and for all column cells at once.

## Core table component

This component can be used in any application without conjunction with the AB-APP backend.

The component has the following properties:

| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| rowsPerPage | Integer | 10 | Number of rows rendered per page |
| selectable | Boolean | false | Whether rows can be selected or not |
| className | String | '' | Name of a custom CSS class (see below) |
| csvExport | Boolean | true | Whether table can be exported as CSV-file |
| emptyTableMessage | String | 'No data specified' | A message, shown when the table is empty. |
| cols | Array of objects | [] | Columns descriptions (see below) |
| rows | Array of objects | [] | Table data (see below) |


### Custom styling (className property)

To apply custom styling you should define `className` property. Your class will be put on top of default table styles, so all your custom styles will override the default. 

For example, to make headers' text green, you should set your custom class: `className = "CustomTable"`. Then write the following CSS in the .css file of your component, where you use table component:
```css
.CustomTable th {
    color: green;
}
```

### Columns descriptions (cols property)

Each table column is an object with the following properties:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| name | String | - | Column name, must have corresponding data in rows objects (see below). |
| title | String | '' | Column title |
| sortOrder | Integer | 0 | Default column sort priority |
| sortDirection | String | 'ASC' | Default column sort direction (ASC or DESC) |
| html | Boolean | false | Whether the cell content should be put to page as html |


The following properties are available only when using tables as part of AB-APP:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| frontendFormatter | String | '' | Name of the frontend formatter function |
| backendFormatter | String | '' | Name of the backend formatter function |

### Table data (rows property)

Each table row is an object that holds the data of the table row. Object keys must be the same as the **names** properties of the cols objects.

For example
```jsx
[{ 
    name: 'Buddy', 
    class: 'Dog', 
    age: 3, 
    gender: 'male' 
},
{ 
    name: 'Molly', 
    class: 'Cat', 
    age: 5, 
    gender: 'female' 
}]
```

### Using component independently
```jsx
import React, { Component } from 'react';

import Table from 'table';

export default class App extends Component {
    render() {
        const cols = [
            { name: 'name', title: 'Pet name' },
            { name: 'class', title: 'Animal class' },
            { name: 'age', title: 'Age' },
            { name: 'gender', title: 'Gender' }
        ]

        const rows = [
            { name: 'Buddy', class: 'Dog', age: 3, gender: 'male' },
            { name: 'Molly', class: 'Cat', age: 5, gender: 'female' },
            { name: 'Bonnie', class: 'Cat', age: 2, gender: 'female' },
            { name: 'Coco', class: 'Parrot', age: 22, gender: 'male' },
            { name: 'Oscar', class: 'Dog', age: 5, gender: 'male' },
            { name: 'Max', class: 'Turtle', age: 15, gender: 'male' },
            { name: 'Jack', class: 'Varan', age: 1, gender: 'male' }
        ]

        return (
            <div
                className="TableContainer" >
                <Table
                    selectable={true}
                    emptyTableMessage={'No animals found'}
                    cols={cols}
                    rows={rows} />
            </div>
        )
    }
}
```

# Forms

Writing forms markup, programming fields validation (both frontend and backend) can be hard! AB-APP makes the whole process a breeze. You just provide form data as a simple json config and that's it! :tada:

Implemented features:
- Live validation as user types
- Consistent frontend-backend validation
- Automatic validation according to DB column types
- Clean, responsible mobile-first CSS markup (horizontal or inline)
- Easy custom styling
- Very fast and lightweight, no dependencies

## Architecture

Architecture is similar to the table architecture. The frontend "knows" only the form's endpoint. It uses a GET request to get the form's configuration, data and validation functions. It uses a POST request to send user data to the backend.

On the backend, there is a corresponding .json file for each form. This file holds fields descriptions. On the frontend, this data goes into fields property of the table component. There is also a .sql file for some forms which holds the query for fetching data for the form fields from a database.

The backend is responsible for building form config and sending it to the frontend. It is also responsible for accepting POST requests, validating data and putting it into the database. 

The frontend has two React components: a high order component (HOC) and a core form component. 

HOC is responsible for fetching form data from the backend and sending user data back - submission of the form. The core component is responsible for rendering and validation.

![Forms architecture](architecture-Forms-AppSync.png)

## Validation

Validation is a very important feature because user experience depends on it a lot.

AB-APP implements realtime validation as user types:
![Live validation](validation.gif)

There is a library of validation functions on the backend. When you configure form fields in the .json file you may put an array of validators functions names which you want to use with this field. 

Some validators will be added in the fields configs automatically by fetching and parsing the corresponding column types from the database.

All validators functions bodies are stored on the backend and they are passed to the frontend as strings. On the frontend, these functions are recreated using `new Function()` constructor which allows to create functions dynamically.

Validator function accepts field value as the first parameter and then zero or multiple additional parameters to perform validation. It returns true or false, which means whether validation is passed or not.

For example, this validator checks that a string length is not less than **min** and not more than **max**.
```jsx
module.exports.strMinMax = (value, min, max) => value.length >= min && value.length <= max;
```

As user types in a field's value it is passed to all field's validators one by one. If none of the validators return false field is considered valid. If one of the validators returns false (first wins) field gets invalidated and the validator's message is shown on the page. The message, as well as additional validator parameters, are stored along with validator function body in the object with validator description (see the description of fields property of the React component).

This logic allows writing validators functions in one place - on the backend, making it the single source of truth. It also allows to apply same validators on the frontend as user types and then on the backend when it receives submitted form. We need to validate data on the backend because we should never trust any data, which is coming from the frontend.

## Core form component

This component can be used in any application without conjunction with the AB-APP backend.

The component has the following properties:


| Property | Type | Default value | Description |
| --- | --- | --- | --- |
| layout | String ('Horizontal' or 'Inline') | 'Horizontal' | Form layout type |
| infoIcon | HTML or JSX | feather info icon | Here you can put your custom "i" icon - it can be a react component |
| buttonText | String or Array of strings | ["Submit", "Sending..."] | Text for the submit button. If an array is given it must contain two elements: one for default state and one for sending state |
| doneText | String | 'Done!' | Text that appears near the submit button if the form was submitted successfully |
| doneTextDuration | Integer | 2000 | Number of milliseconds to display doneText near the submit button |
| className | String | '' | Name of a custom class (see below) |
| submitHandler | Function | null | Function that will be invoked when the form is submitted |
| fields | Array of objects | [] | Form fields (see below) |


### Styling

Forms can be rendered as horizontal (default, CSS grid is used) or inline (layout="Inline" prop must be set, CSS flex is used). Styles of the form can be overridden by custom className.

You can put a custom class on top of default form styles, so all custom styles will override the default. For example, to make labels green, you should set your custom class: `className = "CustomForm"`. Then write the following CSS in the .css file of your component, where you use react-ab-form:
```css
.CustomForm .Label {
    color: green;
}
```

### Submitting form
Use **submitHandler** property to set a function that will be invoked when the form is submitted. Values of the form will be passed to this function as a parameter. This function must return a promise. 

If the promise resolves `doneText` is shown near the submit button. 

If the promise rejects (it can happen when the server invalidates a field, for example), the error will be caught by the form component. It expects to receive the error in the following format:
```
{
    response: {
            data: {
                field: {
                    name: 'field_name_here',
                    message: 'error_message_here'
                }
            }
        }
}
```

If the form component receives error it shows error message the same way it does when a form field is invalidated on the frontend.

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

### Using component independently
In this code, we use [axios](https://github.com/axios/axios) to send a post request. 

```jsx
import React, { Component } from 'react';
import axios from 'axios';

import FormComponent from 'Form';

export default class App extends Component {
    render() {
        const conf = {
            submitHandler: values => {
                console.log('Form values should be sent to the server here.');
                console.log('submitHandler must return promise.');
                return axios.post('api_endpoint_here', values)
                            .then(response => /*do something*/);
             }
        }

        const fields = [
            {
                name: 'name',
                label: 'Pet name',
                type: 'String',
                required: true,
                validators: [
                    {
                        params: [4, 64],
                        message: 'Must be bigger than 4 and smaller than 64 chars',
                        f: (value, minLength, maxLength) => value.length >= minLength && value.length <= maxLength
                    },
                    {
                        message: 'Can\'t contain digits',
                        f: value => !/[1-9]/.test(value)
                    },
                ]
            }
        ]

        return <FormComponent {...conf} fields={fields} />;
    }
}
```

## How to contribute
1. Click the "Fork" button.
2. Clone your fork to your local machine:
```shell
git clone https://github.com/YOUR_USERNAME/ab-app.git
```
3. Add 'upstream' repo to keep your form up to date:
```shell
git remote add upstream https://github.com/gnemtsov/ab-app.git
```
4. Fetch latest upstream changes:
```shell
git fetch upstream
```
5. Checkout your master branch and merge the upstream repo's master branch:
```shell
git checkout master
git merge upstream/master
```
6. Create a new branch and start working on it:
```shell
git checkout -b NEW_FEATURE
```
7. Push your changes to GitHub.
8. Go to your fork's GitHub page and click the pull request button.

### Further reading
* [How to contribute to a project on Github](https://gist.github.com/MarcDiethelm/7303312)
* [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)
* [Fork A Repo - User Documentation](https://help.github.com/articles/fork-a-repo/)
* [Development workflow with Git: Fork, Branching, Commits, and Pull Request](https://github.com/sevntu-checkstyle/sevntu.checkstyle/wiki/Development-workflow-with-Git:-Fork,-Branching,-Commits,-and-Pull-Request)


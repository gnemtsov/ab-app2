"use strict";

const { FORM } = require("core/index");

//Params: -
//Returns fields of a given form
module.exports = (event, context, callback) => {
	FORM.getAsObject(event.arguments.formName, [event.arguments.dataId]).then(fields => callback(null, fields));
};

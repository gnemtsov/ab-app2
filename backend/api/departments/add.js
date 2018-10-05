"use strict";

/******************************************************************/
/*********************Departments API: Add*************************/
/******************************************************************/

const { DB, FORM } = require("core/index");

//Params: d_title, d_head, d_size, d_created
//Inserts new department
module.exports = (event, context, callback) => {
	const values = event.arguments.department;

	FORM.isValid("department", values).then(validationResult => {
		if (validationResult.name !== null) {
			return callback(null, validationResult);
		}

		const sql = `
				INSERT into departments (d_title, d_head, d_created, d_size) 
				VALUES (?, ?, ?, ?)
			`;
		const params = [values["d_title"], values["d_head"], values["d_created"], values["d_size"]];

		DB.connect()
			.then(conn => conn.execute(sql, params))
			.then(() => callback(null, validationResult));
	});
};

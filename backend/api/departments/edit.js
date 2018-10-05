"use strict";

/******************************************************************/
/*********************Departments API: Edit************************/
/******************************************************************/

const { DB, FORM } = require("core/index");

//Params: d_id, d_title, d_head, d_size, d_created
//Edit department
module.exports = (event, context, callback) => {
	const values = event.arguments.department;

	FORM.isValid("department", values).then(validationResult => {
		if (validationResult.name !== null) {
			return callback(null, validationResult);
		}

		const sql = `
				UPDATE departments
				SET d_title = ?, d_head = ?, d_created = ?, d_size = ?
				WHERE d_id = ?
				LIMIT 1
			`;
		const params = [values["d_title"], values["d_head"], values["d_created"], values["d_size"], values["d_id"]];

		DB.connect()
			.then(conn => conn.execute(sql, params))
			.then(() => callback(null, validationResult));
	});
};

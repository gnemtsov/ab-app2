"use strict";

const { DB, FORM } = require("core/index");

//Params: d_id, d_title, d_head, d_size, d_created
//Edit department
module.exports = (event, context, callback) => {
    const departmentId = event.arguments.departmentId;

    const sql = `
			DELETE FROM departments
			WHERE d_id = ?
		`;
    const params = [
        departmentId
    ];

    DB.connect()
        .then(conn => conn.execute(sql, params))
        .then(result => {
            const [{ affectedRows }] = result;
            if (affectedRows === 0) {
                return callback({
                    type: "Data remove failure",
                    message: "Data was not updated"
                });
            } else {
                return callback(null, {
                    d_id: departmentId
                });
            }
        })
}
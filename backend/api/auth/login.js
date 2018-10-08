"use strict";

/******************************************************************/
/***********************Auth API: Login****************************/
/******************************************************************/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");

const { DB, FORM } = require("core/index");

//Method: POST
//Params: login, password
//Checks login and password, provides new tokens for valid user
module.exports = (event, context, callback) => {
	FORM.isValid("login", event.arguments).then(validationResult => {
		if (validationResult.name !== null) {
			return callback(validationResult);
		}

		const { u_login, u_password } = event.arguments;
		const { sourceIp } = event.identity;
		const sql = `
				SELECT u_id, u_login, u_firstname, u_lastname, u_password, u_timezone, u_access
				FROM users 
				WHERE u_login = ?
			`;

		DB.connect()
			.then(conn => conn.execute(sql, [u_login]))
			.then(([rows]) => {
				if (!rows.length) {
					return callback(FORM.invalidField("login", "User not found."));
				} else if (rows[0].u_access !== 1) {
					return callback(FORM.invalidField("login", "Access for the user is blocked."));
				} else if (!bcrypt.compareSync(u_password, rows[0].u_password)) {
					return callback(FORM.invalidField("password", "Wrong password."));
				} else {
					const accessToken = jwt.sign(
						{
							login: rows[0].u_login,
							name: rows[0].u_lastname + " " + rows[0].u_firstname,
							timezone: rows[0].u_timezone
						},
						process.env.SECRET,
						{
							subject: rows[0].u_id.toString(),
							expiresIn: 60 * 60
						}
					);
					const refreshToken = randtoken.uid(256);
					const sql = `
							INSERT into refreshtokens(rt_user_id, rt_token, rt_created, rt_updated, rt_expires, rt_ip) 
							VALUES (${rows[0].u_id}, '${refreshToken}', NOW(), NOW(), NOW() + INTERVAL 1 MONTH, '${sourceIp}')
						`;

					DB.connect()
						.then(conn => conn.query(sql))
						.then(() => callback(null, { accessToken: accessToken, refreshToken: refreshToken }));
				}
			});
	});
};

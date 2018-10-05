"use strict";

const jwt = require("jsonwebtoken");

//Checks if the user is authorized to perform the action
exports.check = event => {
	const { module: apiModule, action: apiAction, arguments: apiArguments } = event;
	let userData = {};

	const openModules = ["auth"];
	if (openModules.includes(apiModule)) {
		return "Access granted";
	}

	if (apiModule === "forms" && apiAction === "getForm" && apiArguments.formName === "login") {
		return "Access granted";
	}

	if (event.headers === undefined || event.headers["Authorization"] === undefined) {
		return "No token provided";
	}

	try {
		const accessToken = event.headers["Authorization"].split(" ")[1];
		userData = jwt.verify(accessToken, process.env.SECRET);
	} catch (error) {
		return "Failed to verify token";
	}

    //--->add fine-grained access control, using info from userData object
    
	return "Access granted";
};

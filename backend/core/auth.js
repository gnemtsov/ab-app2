"use strict";

const jwt = require("jsonwebtoken");

//Checks if the user is authorized to perform the action
//Return string "Access granted" or object if not
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

    if (event.headers === undefined || event.headers["x-app-token"] === undefined) {
        return { type: "Unauthorized", message: "No token provided" };
    }

    try {
        const [type, accessToken] = event.headers["x-app-token"].split(" ");
        if (type !== "Bearer") throw new Error("Wrong token type");
        userData = jwt.verify(accessToken, process.env.SECRET);
    } catch (error) {
        return { type: "Unauthorized", message: "Failed to verify token" };
    }

    //--->add fine-grained access control, using info from userData object
    //return { type: "Forbidden", message: "..." }; if requested action is not allowed for the user

    return "Access granted";
};

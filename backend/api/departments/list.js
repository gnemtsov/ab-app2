"use strict";

const { TABLE } = require("core/index");

//Params: -
//Returns departments list table
module.exports = (event, context, callback) => {
    TABLE.getAsObject("departments").then(table => callback(null, table));
};

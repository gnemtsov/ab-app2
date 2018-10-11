"use strict";

const fs = require("fs");
const { AUTH } = require("core/index");

//process.env.PROD is set in production only
if (process.env.PROD !== "1") {
    const dotenv = require("dotenv");
    const envConfig = dotenv.parse(fs.readFileSync(".env"));
    for (var k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

//Needed for global error handler
Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
Error.stackTraceLimit = 20;

const buildErrorInfo = err => {
    return {
        message: err.message,
        stack: err.stack.map(c => {
            return {
                This: c.getThis(),
                TypeName: c.getTypeName(),
                FunctionName: c.getFunctionName(),
                MethodName: c.getMethodName(),
                FileName: c.getMethodName(),
                LineNumber: c.getLineNumber(),
                ColumnNumber: c.getColumnNumber(),
                EvalOrigin: c.getEvalOrigin(),
                IsToplevel: c.isToplevel(),
                IsEval: c.isEval(),
                IsNative: c.isNative(),
                IsConstructor: c.isConstructor()
            };
        })
    };
};

//main handler
exports.handler = (event, context, callback) => {
    //global error handler and labda settings
    const handleFatalError = (err, type) => {
        console.error(`>>>>>> ${type} <<<<<<`);
        console.error(`${err.message}`);
        err.stack.forEach(c => {
            console.error(`| ${c.getLineNumber()}:${c.getColumnNumber()} ${c.getEvalOrigin()}`);
        });
        console.error(`<<<<<< ${type.replace(/.+?/g, "-")} >>>>>>`);
        console.log();

        // if c.getThis() returns a cyclic object,
        // error would be thrown in callback, and client would get 502.
        // TODO: do something
        //const errorInfo = buildErrorInfo(err);
        // TODO: log errorInfo to S3

        return callbackWrapper("Something went wrong");
    };

    if (process.listenerCount("unhandledRejection") === 0) {
        process.on("unhandledRejection", (reason, p) => {
            handleFatalError(reason, "unhandledRejection");
        });
    }

    if (process.listenerCount("uncaughtException") === 0) {
        process.on("uncaughtException", err => {
            handleFatalError(err, "uncaughtException");
        });
    }

    if (process.listenerCount("warning") === 0) {
        process.on("warning", warn => {
            // TODO: save warning to S3 (or somewhere else)
            console.log(buildErrorInfo(warn));
        });
    }

    context.callbackWaitsForEmptyEventLoop = false;

    //current datetime
    const d = new Date();
    console.log(`Time: ${d.toTimeString()}`);

    //parse event
    const {
        module: apiModule,
        action: apiAction,
        headers,
        identity,
        arguments: apiArguments
    } = event;

    let logHeaders = {};
    if (headers !== undefined && headers !== null) {
        Object.keys(headers).map(function(key, index) {
            const value =
                key === "x-amz-security-token"
                    ? headers[key].substring(0, 15) + "...[truncated]"
                    : headers[key];
            logHeaders[key] = value;
        });
    }

    console.log(`***************Request***************`);
    console.log(`Client -----Event-----> API[${apiModule}/${apiAction}]`);
    console.log(`Identity: ${JSON.stringify(identity)}`);
    console.log(`Headers: ${JSON.stringify(logHeaders)}`);
    console.log(`Arguments: ${JSON.stringify(apiArguments)}`);
    console.log(`*************************************`);
    console.log();

    //callback wrapper
    const callbackWrapper = (error, result) => {
        console.log(`**************Response***************`);
        if (error === null) {
            console.log(`Client <--- Data <--- API[${apiModule}/${apiAction}]`);
            console.log(`Data: ${JSON.stringify(result)}`);
            callback(null, result);
        } else {
            if (typeof error === "string") {
                error = {
                    type: error
                };
            }
            console.log(`Client <--- Error <--- API[${apiModule}/${apiAction}]`);
            console.log(`Error: ${JSON.stringify(error)}`);
            callback(JSON.stringify(error));
        }
        console.log(`*************************************`);
    };

    //main
    try {
        //Check if API module and action exist
        const modulePath = "api/" + apiModule;
        if (!fs.existsSync(modulePath)) {
            return callbackWrapper(`Module "${modulePath}" not found.`);
        }
        const actionPath = modulePath + "/" + apiAction + ".js";
        if (!fs.existsSync(actionPath)) {
            return callbackWrapper(`Action "${actionPath}" not found.`);
        }

        //Authorization check
        const authMessage = AUTH.check(event);
        if (authMessage !== "Access granted") {
            return callbackWrapper(authMessage);
        }

        //Run the api action with callback wrapper
        return require(actionPath)(event, context, callbackWrapper);
    } catch (err) {
        handleFatalError(err, "main handler exception");
    }
};

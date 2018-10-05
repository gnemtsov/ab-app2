'use strict';

//Booleans
module.exports.boolTrue = value => value;

//Strings
module.exports.strMinMax = (value, min, max) => typeof value === 'string' && value.length >= min && value.length <= max;
module.exports.strMax = (value, max) => typeof value === 'string' && value.length <= max;
module.exports.strEquals = (value, str) => typeof value === 'string' && value === str;
module.exports.strIsDate = value => typeof value === 'string'&& Date.parse(value) !== NaN;

//Numbers
module.exports.numType = value => /^-?[0-9]*$/.test(value);
module.exports.numMinMax = (value, min, max) => Number(value) >= min && Number(value) <= max;
module.exports.numMin = (value, min) => Number(value) >= min;
module.exports.numMax = (value, max) => Number(value) <= max;

//Floating numbers
module.exports.floatType = value => /^-?[0-9]*(\.[0-9]*)?$/.test(value);

//Dates
module.exports.dateMin = (value, min) => new Date(value) >= new Date(min);
module.exports.dateMax = (value, max) => new Date(value) <= new Date(max);

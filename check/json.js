'use strict';
const Promise = require('bluebird');

const checkObject = function (json,check) {
    if(!(json instanceof Object)) {
        return Promise.reject(`Is not a Object.`);
    }
    let key = Object.keys(check);
    for(let i = 0; i<key.length; i++){
        if(!json.hasOwnProperty(key[i])) {
            return Promise.reject(`Object don't have property '${i}'`);
        }
        return jsonCheck(json[key[i]],check[key[i]]);
    }
};
const checkArray = function (json,check) {
    if(!(json instanceof Array)) {
        return Promise.reject(`Is not a Array.`);
    }
    for(let i = 0; i<check.length; i++){
        if(!json[i]) {
            return Promise.reject(`Array don't have value [${i}]`);
        }
        return jsonCheck(json[i],check[i]);
    }
};
const checkValue = function (json,check) {
    if(check.slice && check.slice(0,2) === '@{') {
        if(instanceOf(json, check)) {
            return Promise.resolve(true);
        }else{
            return Promise.reject(`'${json}' is not [${check}]`);
        }
    }else{
        if(json === check) {
            return Promise.resolve(true);
        }else{
            return Promise.reject(`'${json}' not equal '${check}'`);
        }
    }

};
const instanceOf = function(obj,instance) {
    switch (instance) {
        case '@{Object}':
            return obj instanceof Object;
        case '@{Number}':
            return typeof obj === 'number';
        case '@{String}':
            return typeof obj === 'string';
    }
    return false;
};
/**
 *
 * @param json
 * @param check | [{userId:@number}]
 */
const jsonCheck = function (json,check) {
    switch (true) {
        case check instanceof Array:
            return checkArray(json,check);
        case check instanceof Object:
            return checkObject(json,check);
        default:
            return checkValue(json,check);
    }
};

module.exports = jsonCheck;
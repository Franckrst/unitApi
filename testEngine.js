'use strict';
const axios = require('axios');
const request = require('./request');
const checkJson = require('./check/json');
const checkBdd = require('./check/bdd');
const Promise = require('bluebird');
/**
 * Start all test
 * @param option
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
const testEngine = function (option) {
    return request(option).
    then((data)=>{ return {response : data};}).
    then((data)=>{
        return Promise.all([
            checkJson(data.response,option.checkJSON),
            checkBdd(data.response,option.checkBDD),
        ]).
        then((dataTest)=>{
            return { status : 'OK' };
        }).
        catch((err)=>{
            return {
                status: 'KO',
                error: err,
                data: data
            };
        });
    });
};

module.exports = testEngine;
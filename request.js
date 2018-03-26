'use strict';
const axios = require('axios');

const PARAMS_REQUIRE = ['target'];
const optionDefault = {
    'url' : '/',
    'method' : 'get'
};

/**
 * Check params require
 * @param option
 */
const checkParams = function(option) {
    for( let i = 0; i < PARAMS_REQUIRE.length; i++) {
        if(option.hasOwnProperty(PARAMS_REQUIRE[i])){
            throw `Your test '${option.title}' need option : ${PARAMS_REQUIRE[i]}`;
        }
    }
};
/**
 * Send request and return value in promise
 * @param option
 * @return Promise
 */
const request = function (option) {
    checkParams(option);
    return axios(option).then(result=>result.data);
};

module.exports = request;
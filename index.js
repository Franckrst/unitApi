'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const Promise = require('bluebird');
const extend = require('deep-extend');
const engineTest = require('./testEngine');
const Capture = require('./capture');

const source = yaml.safeLoad(fs.readFileSync('example.yml', 'utf8'));

let result = [];
// Groupe of test
for (let i = 0; i < source.groupe.length; i++) {
    let testPormise = new Promise(resolve => resolve());g
    let captureGroupe = new Capture();
    // Start test //source.groupe[i].test.length
    for (let x = 0; x < source.groupe[i].test.length; x++) {
        testPormise = testPormise.then(
            () => {
                source.groupe[i].test[x] = captureGroupe.injectObj(source.groupe[i].test[x]);
                return engineTest(extend({},source.config, source.groupe[i].test[x]))
                // Save result
                    .then((result) => source.groupe[i].test[x].result = result)
                    .then((result)=>{
                        return result;
                    })
                    // Capture
                    .then((result) => {
                        if(source.groupe[i].test[x].capture){
                            captureGroupe.parse(source.groupe[i].test[x].capture,result.response);
                        }
                        return result;
                    });
            }
        );
        result.push(testPormise);
    }
}
Promise.all(result).then((data)=>{
    console.log(JSON.stringify(data));
})
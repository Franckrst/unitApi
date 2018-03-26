'use strict';
const Promise = require('bluebird');
const Client = require('ssh2').Client;

const mysql = require('mysql2');
const fs = require('fs');
const jsonCheck = require('./json');

const mysqlConnect = function(options) {
    return new Promise(function(resolve, reject) {
        const connection = mysql.createConnection(options);
        connection.connect(function (error) {
            if (error) return reject(error);
            resolve(connection);
        });
    });
};

const sshTunnel = function(options) {
    return new Promise((resolve, reject) => {
        if(options.privateKey) {
            options.privateKey = fs.readFileSync(options.privateKey);
        }
        const sshClient = new Client();
        sshClient.on('ready', function () {
            sshClient.forwardOut(
                '127.0.0.1',
                3306,
                '127.0.0.1',
                3306,
                function (err, stream) {
                    if (err) return reject(err); // SSH error: can also send error in promise ex. reject(err)
                    // use `sql` connection as usual
                    resolve(stream);
                });
        }).connect(options);
    });
};
const mysqlQuery = function (options, connectionBdd) {
    return new Promise(function(resolve, reject) {
        connectionBdd.query(options.sql, function (error, results, fields) {
            if (error) return reject(error);
            jsonCheck(results,options.result).then(resolve, reject);
        });
    });
}
const jsonBdd = function (json,options) {
    return new Promise(function(resolve, reject) {
        let connection;
        if (options.mysql.overSSH) { //tunnel ssh
            connection = sshTunnel(options.mysql.overSSH)
                .then((stream) => {
                    options.mysql.stream = stream;
                    return mysqlConnect(options.mysql);
                });
        } else {
            connection = mysqlConnect(options.mysql);
        }
        connection.then((connectionBdd) => {
            //jsonCheck
            const queryPromise = [];
            for(let i = 0; i < options.query.length; i++){
                queryPromise.push(mysqlQuery(options.query[i],connectionBdd));
            }
            Promise.all(queryPromise).then(resolve, reject);
        });
    });
};

module.exports = jsonBdd;
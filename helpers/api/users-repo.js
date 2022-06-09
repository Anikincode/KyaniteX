import {mretsService} from "../../services/mrets.service";
//import {client} from "../../helpers/api/db";
import pg from "pg";

const fs = require('fs');

import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
const dotenv = require('dotenv');
dotenv.config();

const PGSQL_USER = process.env.PGSQL_USER;
const PGSQL_PASSWORD = process.env.PGSQL_PASSWORD;
const PGSQL_HOST = process.env.PGSQL_HOST;
const PGSQL_PORT = process.env.PGSQL_PORT;
const PGSQL_DATABASE = process.env.PGSQL_DATABASE;
var conString = "postgres://postgres:postgres@localhost:5432/kyanitex";
//var conString = "postgres://"+ PGSQL_USER +":"+ PGSQL_PASSWORD +"@"+ PGSQL_HOST +":"+ PGSQL_PORT +"/"+ PGSQL_DATABASE;

// users in JSON file for simplicity, store in a db for production applications
let users = require('data/users.json');

export const usersRepo = {
    getAll: () => users,
    getById: id => users.find(x => x.id.toString() === id.toString()),
    find: x => users.find(x),
    create,
    update,
    delete: _delete
};

async function create(user) {
    // generate new user id
    user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;

    // set date created and updated
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();
//    user.mretAccountId = mretsService.getAccount(user.id);
    // add and save user
    users.push(user);
    saveData();

    var client = new pg.Client(conString);
    client.connect();
    try {
        client.query(
            "INSERT INTO users(firstname, lastname, username, hash, id, datecreated, dateupdated)VALUES(" + "'"+ user.firstName + "','" + user.lastName +"','"+ user.username +"','"+ user.hash +"' ,'"+ user.id +"','"+ user.dateCreated +"','"+ user.dateUpdated +"')",
            (err, res) => {
                console.log(err, res);
                //conn.end();
            }
        );
        console.log( "Result",result );
    } catch ( error ) {
        console.log( error );
    }
}

function update(id, params) {

    const user = users.find(x => x.id.toString() === id.toString());

    // set date updated
    user.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(user, params);
    saveData();
    var client = new pg.Client(conString);
    client.connect();
    try {
        client.query(
            "UPDATE users SET firstname = " + "'" + user.firstName + "',  lastname= '" + user.lastName + "', username= '" + user.username + "', hash= '" + user.hash + "', dateupdated= '" + user.dateUpdated + "' WHERE id = '" + user.id + "';",
            (err, res) => {
                console.log(err, res);
                //conn.end();
            }
        );
        console.log( "Result", result );
    } catch ( error ) {
        console.log( error );
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted user and save
    users = users.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}
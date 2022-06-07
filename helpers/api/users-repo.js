import {mretsService} from "../../services/mrets.service";
import conn from '../../helpers/api/db'

const fs = require('fs');

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
   /* try {
        console.log("User First Name:", user.firstName)
        conn.query(
            "INSERT INTO users(firstName, lastName, username, hash, id, dateCreated, dateUpdated)VALUES('Nicholas', 'Goorwah', 'nick@dabc.com', '$2a$10$HCSgIoaqlIz1oYv5yVRhOOCvoXIdNbfxlaaBmNMGl37pOBOhxDudm', 123454322, '2022-06-07T13:33:24.922Z', '2022-06-07T13:33:24.922Z')",
            (err, res) => {
                console.log(err, res);
                conn.end();
            }
        );
        console.log( "Result",result );
    } catch ( error ) {
        console.log( error );
    }
    */
}

function update(id, params) {
    const user = users.find(x => x.id.toString() === id.toString());

    // set date updated
    user.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(user, params);
    saveData();
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
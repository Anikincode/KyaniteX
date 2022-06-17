import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchMrets } from 'helpers/fetch-mrets';

const { publicRuntimeConfig } = getConfig();
const mretUrl = `${publicRuntimeConfig.mretUrl}/v1/public/rec/accounts`;
const mretOrganizations = `${publicRuntimeConfig.mretUrl}/v1/public/rec/organizations`;
const mretContacts = `${publicRuntimeConfig.mretUrl}/v1/public/rec/contacts`;
const mretSubject = new BehaviorSubject(process.browser);

export const mretsService = {
    mret: mretSubject.asObservable(),
        get mretValue () { return mretSubject.value },
    createAccount,
    getOrganizationList,
    getContact,
    logout
};

function createAccount(user) {
    return fetchMrets.post(`${mretUrl}`, {
        "data": {
            "type": "accounts",
            "attributes": {
                "account_type": "active",
                "name": 'TEST 1 VEM'
            }
        }
    })
        .then(account => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            mretSubject.next(account);
            localStorage.setItem('mret_account', JSON.stringify(account));
            return account;
        });
}

function getOrganizationList() {
    return fetchMrets.get(`${mretOrganizations}`)
        .then(organizations => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            mretSubject.next(organizations);
            localStorage.setItem('organizations', JSON.stringify(organizations));
            return organizations;
        });
}

function getContact(org) {
    var org = localStorage.getItem('organizations');
    var id = JSON.parse(org);
    fetchMrets.get(`${mretOrganizations}/`+ id + '/contact')
        .then(contact => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            mretSubject.next(contact);
            localStorage.setItem('contact', JSON.stringify(contact));
            return contact;
        });
}

/*
function getAccount() {
    const account = localStorage.getItem('mret_account');
    const accountId = account.data.id;
    return fetchMrets.get(`${mretUrl}/${accountId}`);
}
*/

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    mretSubject.next(null);
    Router.push('/account/login');
}

/*
function register(user) {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value.id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

 */
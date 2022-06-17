import getConfig from 'next/config';

import {mretsService, userService} from 'services';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const fetchMrets = {
    get,
    post,
    put,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/vnd.api+json','X-Api-Key':'rkQVa8X1ra3jkF6opuNz7VVK', ...authHeader(url) },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const secret = serverRuntimeConfig.mret_secret;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.api+json','Accept':'application/vnd.api+json','X-Api-Key':'rkQVa8X1ra3jkF6opuNz7VVK', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/vnd.api+json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const token = serverRuntimeConfig.mret_secret2;
    const isLoggedIn = user && token;
    const isApiUrl = url.startsWith(publicRuntimeConfig.mretUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
               // userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        secret: 'kjhashhsdkfajhfkahjdkfaKJHHK',
        mret_secret: 'rkQVa8X1ra3jkF6opuNz7VVK',
        mret_secret2: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5M2I4NTk3OC1mNjAwLTRkM2MtYTU',
        PGSQL_USER: 'postgres',
        PGSQL_PASSWORD: 'postgres',
        PGSQL_HOST: '127.0.0.1',
        PGSQL_PORT: '5432',
        PGSQL_DATABASE: 'kyanitex'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'http://localhost:3000/api', // production api
        mretUrl: process.env.NODE_ENV === 'development'
            ? 'https://api-sandbox.mrets.org'  // development api
            : 'https://api-sandbox.mrets.org' // production api
    }
}

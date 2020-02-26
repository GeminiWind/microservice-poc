export const CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials';
export const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

// salt round for compute password in bcrypt.
// If it is bigger and bigger, the time to generate password
// as well as brute-force attacking is longer and longer
export const SALT_ROUND = 10;

export const EXPIRY_ACCESS_TOKEN = 5; // in minutes
export const EXPIRY_REFRESH_TOKEN = 30; // in minutes

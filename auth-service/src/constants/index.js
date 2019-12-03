export const PASSWORD_GRANT_TYPE = 'password';
export const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

// salt round for compute password in bcrypt.
// If it is bigger and bigger, the time to generate password
// as well as brute-force attacking is longer and longer
export const SALT_ROUND = 10;

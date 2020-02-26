
import * as R from 'ramda';
import { BadRequestError, NotImplementedError } from 'json-api-error';
import { schemaValidator } from '@hai.dinh/service-libraries';
import schemas from '../../resources/schemas';
import { password, refreshToken } from './strategies';
import { CLIENT_CREDENTIALS_GRANT_TYPE, REFRESH_TOKEN_GRANT_TYPE } from '../../constants';

export function validateRequest(req) {
  // FIXME: validate request by updating scheme
  // const validator = schemaValidator.compile(schemas.loginUserSchema);
  // const isValid = validator(req.body);

  // if (!isValid) {
  //   console.error('Error in validate request %s', JSON.stringify(validator.errors, null, 2));

  //   throw new BadRequestError({
  //     source: validator.errors,
  //   });
  // }

  return req;
}

export function handleByGrantType(req) {
  const grantType = R.path(['query', 'grant_type'], req);

  if (grantType === CLIENT_CREDENTIALS_GRANT_TYPE) {
    return password(req);
  }

  if (grantType === REFRESH_TOKEN_GRANT_TYPE) {
    return refreshToken(req);
  }

  throw new NotImplementedError('Strategy has not been implemented.');
}

export default R.pipeP(
  req => Promise.resolve(req),
  validateRequest,
  handleByGrantType,
);

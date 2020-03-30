import * as R from 'ramda';

export function returnResponse(req) {
  return {
    statusCode: 200,
    body: {},
    headers: {
      'X-Useremail': req.user.email,
    },
  };
}

export default R.pipeP(
  req => Promise.resolve(req),
  returnResponse,
);

import { MalformedError } from 'json-api-error';

export default function malformedErrorHandler(e, _, res, next) {
  // if error is belong to malformed JSON
  if (e instanceof SyntaxError
      && e.status === 400
      && e.message.includes('JSON')
  ) {
    next(new MalformedError())
  } else {
    next();
  }
}

import { MalformedError } from 'json-api-error';

export default function malformedErrorHandler(e, _, res, next) {
  if (e) {
    if (e instanceof SyntaxError && e.status === 400 && e.message.includes('JSON')
    ) {
      next(new MalformedError('Error in reading malformed JSON'));
    } else {
      next(e);
    }
  } else {
    next();
  }
}

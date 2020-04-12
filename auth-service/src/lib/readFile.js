import fs from 'fs';
import * as R from 'ramda';
import { InternalError } from 'json-api-error';

const readFile = R.tryCatch(
  R.pipe(
    (path) => fs.readFileSync(path),
    (data) => data.toString(),
  ),
  () => {
    throw new InternalError('Error in reading file');
  },
);

export default readFile;

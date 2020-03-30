import jwt from 'jsonwebtoken';

export default function generateToken(payload, secretKey, opts) {
  const token = jwt.sign(
    payload,
    secretKey,
    opts,
  );

  return token;
}

import { __jwt_secret__ } from '@src/constants';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

(async () => {
  const id = new ObjectId();
  const pass = crypto.randomUUID().replace(/-/g, '');

  const hashPass = bcrypt.hashSync(pass, 8);

  const token = jwt.sign(
    {
      iss: 'Hotel Manager',
      key: pass,
      id,
    },
    __jwt_secret__
  );

  console.log({ id, token, hashPass });
})();

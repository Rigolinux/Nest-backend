/* eslint-disable prettier/prettier */

//don't forget this is an arrow function
export const EnvConfig =() => ( {
  envirioment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  host: process.env.DB_HOST,
  portDb: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.USER_DB,
  password: process.env.USER_DB_PASSWORD,
  jwt_secret: process.env.JWT_SECRET,
});

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
//this file helps us to filter the files that we want to upload
// if the file is correct it will return true if not it will return false

import { v4 as uuid } from "uuid";

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
    // if the file is not an image, return false
    if (!file) return callback(new Error('The file is empty'), false);

    // get the file extension
    const fileExt = file.mimetype.split('/')[1];

    if (!fileExt) return callback(new Error('The file extension is empty'), false);
   
    const fileName = `${uuid()}.${fileExt}`;

    // end the function and return true
  callback(null, fileName);
};

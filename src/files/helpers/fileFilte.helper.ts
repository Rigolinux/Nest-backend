/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
//this file helps us to filter the files that we want to upload
// if the file is correct it will return true if not it will return false

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
    // if the file is not an image, return false
    if (!file) return callback(new Error('The file is empty'), false);

    // get the file extension
    const fileExtention = file.mimetype.split('/')[1];
    // files that we want to accept
    const allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif'];

    // if the file extension is not in the allowedFileExtensions array, return false
    if (!allowedFileExtensions.includes(fileExtention)) {
        return callback(
            null,
            false,
        );
    }

    // end the function and return true
  callback(null, true);
};

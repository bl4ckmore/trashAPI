const fileUpload = require("express-fileupload");

const uploadMiddleware = fileUpload({ useTempFiles: true });

module.exports = uploadMiddleware;

const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = process.env.UPLOAD_FILE || "public/images/users";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});
const upload = multer({ storage: storage });
module.exports = { upload };

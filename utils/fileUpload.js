const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.tx_org_id}.jpg`);
  },
});

const upload = multer({ storage: storage });
const uploadSingle = upload.single("image");

module.exports = uploadSingle;

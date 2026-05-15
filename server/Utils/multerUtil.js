const multer = require("multer");
const fs = require("fs");
const path = require("path");

function createMulterUpload(folderName) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //for seller details create . to upload files into different folder (idProof and personalImage)
      // choose folder based on fieldname
      let dynamicFolder = folderName;
      if (file.fieldname === "idProof") {
        dynamicFolder = `${dynamicFolder}/IdProofs/${req.body.updatedForm.email}`;
      } else if (file.fieldname === "personalImage") {
        dynamicFolder = `${dynamicFolder}/PersonalImages/${req.body.updatedForm.email}`;
      } else if (file.fieldname === "productImages") {
        dynamicFolder = `${dynamicFolder}/${req.seller.email}`;
      } else if (file.fieldname.startsWith("images_")) {
        dynamicFolder = `${dynamicFolder}/${req.user.email}-${req.user._id}`;
      }


      const uploadPath = path.join(
        __dirname,
        "../Public/Uploads",
        dynamicFolder
      );

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      // Get original name without extension
      const originalName = path.parse(file.originalname).name;

      // Build new file name: fieldName-originalName-unique.ext
      cb(
        null,
        `${file.fieldname}-${originalName}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`
      );
    },
  });

  return multer({ storage });
}

const deleteFiles = async (relativeFilePaths) => {
  try {
    if (!Array.isArray(relativeFilePaths)) {
      relativeFilePaths = [relativeFilePaths]; // ensure it's always an array
    }

    for (const relativeFilePath of relativeFilePaths) {
      const absolutePath = path.join(__dirname, "../Public", relativeFilePath);

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      } else {
        console.log(`File not found: ${absolutePath}`);
      }
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

module.exports = {
  createMulterUpload,
  deleteFiles,
};

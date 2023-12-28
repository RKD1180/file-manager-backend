const express = require("express");
const {
  createFolder,
  getAllFolders,
  uploadFile,
  getAllFiles,
  editFile,
  deleteFile,
  searchFileByFilename,
} = require("../controllers/fileController.js");

const router = express.Router();

router.get("/search/:filename", searchFileByFilename);
router.get("/files", getAllFiles);
router.get("/folders", getAllFolders);
router.post("/folder", createFolder);
router.put("/edit/:fileId", editFile);
router.delete("/delete/:fileId", deleteFile);
router.post("/upload", uploadFile);

module.exports = router;

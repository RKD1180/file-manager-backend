const File = require("../models/File");
const Folder = require("../models/Folder");

// create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a folder with the same name already exists
    const existingFolder = await Folder.findOne({ name });

    if (existingFolder) {
      return res.json({
        error: {
          message: "A folder with the same name already exists",
          status: 500,
        },
      });
    }

    // Create a new folder
    const newFolder = new Folder({
      name,
    });

    // Save the folder to the database
    await newFolder.save();

    res.json({
      message: "Folder created successfully",
      folderId: newFolder._id,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.json({ error: { message: error.message, status: 500 } });
  }
};

// get all folders
exports.getAllFolders = async (req, res) => {
  try {
    // Retrieve all folders from the database
    const folders = await Folder.find();

    res.json({ folders, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// upload files
exports.uploadFile = async (req, res) => {
  try {
    const { filename, content, folderId, size } = req.body;

    // Check if the folder exists
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.json({ message: "Folder not found.", status: 400 });
    }

    // Create a new file document in MongoDB
    const file = new File({
      filename,
      content,
      folder,
      size,
    });

    // Save the file to MongoDB
    await file.save();

    res.json({
      message: "File uploaded successfully",
      fileId: file._id,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", status: 500 });
  }
};

// edit file
exports.editFile = async (req, res) => {
  try {
    const { filename, content, folderId, size } = req.body;
    const { fileId } = req.params;

    // Check if the file exists
    const file = await File.findById(fileId);
    if (!file) {
      return res.json({ message: "File not found.", status: 404 });
    }

    // Check if the folder exists
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.json({ message: "Folder not found.", status: 400 });
    }

    // Update file properties
    file.filename = filename;
    file.content = content;
    file.size = size;
    file.folder = folder;

    // Save the updated file to MongoDB
    await file.save();

    res.json({
      message: "File updated successfully",
      fileId: file._id,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", status: 500 });
  }
};

// Get all files with populated folder information
exports.getAllFiles = async (req, res) => {
  try {
    let sort = {}; // Default sorting

    // Check if sorting by createdAt is requested
    if (req.query.sortBy === "size") {
      sort = { size: -1, createdAt: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    const files = await File.find().populate("folder").sort(sort);

    res.json({
      files,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: { message: "Internal server error", status: 500 } });
  }
};

// delete file
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Check if the file exists
    const file = await File.findById(fileId);
    if (!file) {
      return res.json({ message: "File not found.", status: 404 });
    }

    // Remove the file from the MongoDB collection
    await File.deleteOne({ _id: fileId });

    res.json({
      message: "File deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", status: 500 });
  }
};

// Search for a file by filename
exports.searchFileByFilename = async (req, res) => {
  try {
    const { filename } = req.params; // Assuming the filename is part of the URL parameters

    // Use a case-insensitive regex to perform a partial match on filenames
    const regex = new RegExp(filename, "i");

    // Find the file(s) matching the regex in the filename
    const files = await File.find({ filename: regex });

    if (!files || files.length === 0) {
      return res.json({
        message: "No matching files found.",
        status: 200,
        files: [],
      });
    }

    res.json({
      files,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", status: 500 });
  }
};

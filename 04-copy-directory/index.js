const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dirCopyName = path.join(__dirname, 'files-copy');
const dirName = path.join(__dirname, 'files');

async function createDir(dirCopyName) {
  await fsPromises.mkdir(dirCopyName, {recursive: true});
}

async function removeDir(dirCopyName) {
  try {
    await fsPromises.rm(dirCopyName, {force: true, recursive: true});
    return;
  } catch (err) {
    console.error(err);
  }
}

const func = async(dirName, dirCopyName) => {
  try {
    await removeDir(dirCopyName);
    await createDir(dirCopyName);
    const files = await fsPromises.readdir(dirName, { withFileTypes: true });
    for (const file of files) {
      const fileString = path.join(dirName, file.name);
      const fileCopyString = path.join(dirCopyName, file.name);
      if (file.isFile())
      {
        fs.copyFile(fileString, fileCopyString, (err) => {if (err) throw err;});
      }
      else {
        func(fileString, fileCopyString);
      }
    }
    return;
  } catch (err) {
    console.error(err);
  }
};


func(dirName, dirCopyName);

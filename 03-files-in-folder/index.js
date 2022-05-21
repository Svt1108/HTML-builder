const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirName = path.join(__dirname, 'secret-folder');

const func = async() => {
  try {
    const files = await fsPromises.readdir(dirName, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile())
      {
        const fileString = path.join(dirName, file.name);
        const fileStat = await fsPromises.stat(fileString);
        console.log(`${path.parse(fileString).name} - ${path.extname(fileString).slice(1)} - ${fileStat.size} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

func();
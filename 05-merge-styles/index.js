const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dirName = path.join(__dirname, 'styles');
const bundleName = path.join(__dirname, 'project-dist/bundle.css');
let r = '';

async function removeBundle(bundleName) {
  try {
    await fsPromises.rm(bundleName, {force: true, recursive: true});
    func();  
    return;
  } catch (err) {
    console.error(err);
  }
}

const func = async() => {
  try {
    const w = fs.createWriteStream(bundleName, { flags: 'a+' });
    const files = await fsPromises.readdir(dirName, { withFileTypes: true });
    for (const file of files) {
      const fileString = path.join(dirName, file.name);
      if (file.isFile()&&path.extname(fileString)==='.css')
      {
        r = fs.createReadStream(fileString);
        r.pipe(w);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

removeBundle(bundleName);
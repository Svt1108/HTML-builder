const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dirDist = path.join(__dirname, 'project-dist');
const dirCopyName = path.join(__dirname, 'project-dist/assets');
const dirName = path.join(__dirname, 'assets');

const dirStylesName = path.join(__dirname, 'styles');
const stylesName = path.join(__dirname, 'project-dist/styles.css');

const templateName = path.join(__dirname, 'template.html');
let r = '';

async function createDir(dirToCreate) {
  await fsPromises.mkdir(dirToCreate, {recursive: true});
}

async function removeDir(fileOrDirToRemove) {
  try {
    await fsPromises.rm(fileOrDirToRemove, {force: true, recursive: true});
    return;
  } catch (err) {
    console.error(err);
  }
}

const func = async(dirName, dirCopyName) => {
  try {
 //   await removeDir(dirCopyName);
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


const makeStyles = async() => {
  try {
    const w = fs.createWriteStream(stylesName, { flags: 'a+' });
    const files = await fsPromises.readdir(dirStylesName, { withFileTypes: true });
    for (const file of files) {
      const fileString = path.join(dirStylesName, file.name);
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


const makeHtml = async() => {
  const r = fs.createReadStream(templateName, 'utf-8');
  let data = '';
  r.on('data', chunk => data += chunk);
  // r.on('end', () => console.log('End', data));
  // r.on('error', error => console.log('Error', error.message));
  
  console.log(data.indexOf('a'));
  
};

const makeDist = async() => {
  await removeDir(dirDist);
  await func(dirName, dirCopyName);
  await makeStyles();
  await makeHtml();
};

makeDist();
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirDist = path.join(__dirname, 'project-dist');
const dirCopyName = path.join(__dirname, 'project-dist/assets');
const dirName = path.join(__dirname, 'assets');

const dirComponentsName = path.join(__dirname, 'components');
const dirStylesName = path.join(__dirname, 'styles');
const stylesName = path.join(__dirname, 'project-dist/style.css');
const htmlName = path.join(__dirname, 'project-dist/index.html');

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

const copyDir = async(dirName, dirCopyName) => {
  try {
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
        copyDir(fileString, fileCopyString);
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
  const files = await fsPromises.readdir(dirComponentsName, { withFileTypes: true });
  let templateHtml =  await fs.promises.readFile(templateName, 'utf-8');

  for (let i = 0; i < files.length; i++) {
    const fileString = path.join(dirComponentsName, files[i].name);
    const tagName = '{{' + path.parse(fileString).name + '}}';
    if (files[i].isFile()&&path.extname(fileString)==='.html')
    {
      const componentText = await fs.promises.readFile(fileString, 'utf-8');
      templateHtml = templateHtml.replace(tagName, componentText);
    }
  }

  const w = fs.createWriteStream(htmlName);
  w.write(templateHtml);
};

const makeDist = async() => {
  await removeDir(dirDist);
  await copyDir(dirName, dirCopyName);
  await makeStyles();
  await makeHtml();
};

makeDist();


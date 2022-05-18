const fs = require('fs');
const fsPromises = require('fs/promises');
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

const func = async(dirName, dirCopyName) => {
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

const test = async(element, partToWrite, w, partToWriteLast) => {
  let rComponents = '';
  let nameComponent;
  nameComponent = element.slice(2, element.length - 2) + '.html';
  rComponents = fs.createReadStream(path.join(dirComponentsName, nameComponent), 'utf-8');
  let text = '';

  rComponents.on('data', (chunk) => (text = text + chunk));
  rComponents.on('end', () => {w.write(partToWrite); w.write(text); w.write(partToWriteLast);});
};

const makeHtml = async() => {
  const r = fs.createReadStream(templateName, 'utf-8');
  const w = fs.createWriteStream(htmlName, { flags: 'a+' });
  let data = '';
  
  let templ = /\{\{([^}}]*)\}\}/g;
  r.on('data', chunk => data += chunk);
  r.on('end', () => {
    let partToWrite;
    let partToWriteLast = '';
    let start = 0;
    let N = 1;
    const array = data.match(templ);
    array.forEach(element => {
      partToWrite = data.slice(start, data.indexOf(element));
      start = data.indexOf(element) + element.length;
      if (N === array.length) {partToWriteLast = data.slice(start, data.length);}
      test(element, partToWrite, w, partToWriteLast);
      N++;
    });
  });
  r.on('error', error => console.log('Error', error.message));
  
};

const makeDist = async() => {
  await removeDir(dirDist);
  await func(dirName, dirCopyName);
  await makeStyles();
  await makeHtml();
};

makeDist();


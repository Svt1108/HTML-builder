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


// const replaceHtml = async(templateText, htmlFiles) => {
//   Object.keys(htmlFiles).forEach((key) => {
//     templateText = templateText.replace('{{' + key + '}}', htmlFiles[key]);
//   }
//   );
//   const w = fs.createWriteStream(htmlName);
//   w.write(templateText); 
// };

const makeHtml = async() => {
  const r = fs.createReadStream(templateName, 'utf-8');
  const files = await fsPromises.readdir(dirComponentsName, { withFileTypes: true });

  let templateText = '';
  let N = 0;
 // let htmlFiles = {};

  r.on('data', (chunk) => (templateText = templateText + chunk));

  r.on('end', () => {
    files.forEach(file => {
      let componentText = '';
      const fileString = path.join(dirComponentsName, file.name);
      const rr = fs.createReadStream(fileString, 'utf-8');
      rr.on('data', (chunk) => (componentText = componentText + chunk));
      rr.on('end', () => {
        const fileString = path.join(dirComponentsName, file.name);
        const tagName = '{{' + path.parse(fileString).name + '}}';
        if (file.isFile()&&path.extname(fileString)==='.html')
        {
          console.log(tagName)
          console.log(componentText)
          templateText = templateText.replace(tagName, componentText);
          if(N === files.length){
            const w = fs.createWriteStream(htmlName);
            w.write(templateText); 
          }
        }
      });
      N++;
    });
    
    // for (let i = 0; i < files.length; i++) {
    //   let text = '';
    //   const file = files[i]; 
    //   const fileString = path.join(dirComponentsName, file.name);
    //   if (file.isFile()&&path.extname(fileString)==='.html')
    //   {
    //     const rr = fs.createReadStream(fileString, 'utf-8');        
    //     rr.on('data', (chunk) => (text = text + chunk));
    //     rr.on('end', () => {htmlFiles[path.parse(fileString).name] = text; if(i === files.length - 1) {replaceHtml(templateText, htmlFiles);console.log(htmlFiles);}});
    //   }
    // }
  });
  r.on('error', error => console.log('Error', error.message));  
};

const makeDist = async() => {
  await removeDir(dirDist);
  await copyDir(dirName, dirCopyName);
  await makeStyles();
  await makeHtml();
};

makeDist();


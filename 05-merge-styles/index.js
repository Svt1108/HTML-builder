const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirStylesName = path.join(__dirname, 'styles');
const bundleName = path.join(__dirname, 'project-dist', 'bundle.css');

async function removeBundle(bundleName) {
  try {
    await fsPromises.rm(bundleName, {force: true, recursive: true}); 
    return;
  } catch (err) {
    console.error(err);
  }
}

const writeText = async(txt) => {
  const w = fs.createWriteStream(bundleName, { flags: 'a+' });
  w.write(txt);
  return;
};

const makeStyles = async() => {
  try {
    const files = await fsPromises.readdir(dirStylesName, { withFileTypes: true });
    for (const file of files) {
      const fileString = path.join(dirStylesName, file.name);
      if (file.isFile()&&path.extname(fileString)==='.css')
      {
        const textFile = await new Promise((resolve, reject) => {
          const r = fs.createReadStream(fileString);
          let text = '';  
          r.on('data', (chunk) => (text = text + chunk));
          r.on('end', () => {
            resolve(text);
          });
          r.on('error', reject);
        });

        await writeText(`${textFile}\n\n`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


const makeBundle = async() => {
  await removeBundle(bundleName);
  await makeStyles();
};

makeBundle();
const { stat } = require('fs');
const fs = require('fs/promises');
const path = require('path');

const dirName = path.join(__dirname, 'secret-folder');

const func = async() => {
  try {
    const files = await fs.readdir(dirName, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile())
      {
        const fileString = path.join(dirName, file.name);
        stat(fileString, (err, stats) => {
          console.log(`${path.parse(fileString).name} - ${path.extname(fileString).slice(1)} - ${stats.size}`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
};

func();
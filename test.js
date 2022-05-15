const fs = require('fs');
const path = require('path');
const os = require('os');

const { stdin, stdout, stderr } = process;

stdout.write('Hello user write the text to console\n');

if (os.platform().slice(0,-2) === 'win') {
  process.on('SIGINT',() => {
    process.exit();
  });
}

process.on('exit', code => {
  if (code === 0) {
    stdout.write('Bye bye user\n');
  } else {
    stderr.write(`Programm finished with code ${code}\n`);
  }
});

function init(data) {
  fs.writeFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw err;
  });
}

stdin.on('data', data => {

  fs.access(path.join(__dirname, 'text.txt'), fs.constants.F_OK, err => {
    if (err) init(data);
  });

  if (`${data}` === 'exit\r\n') {
    process.exit();
  }

  fs.appendFile(path.join(__dirname, 'text.txt'), data, err => {
    if (err) throw err;
  });
});
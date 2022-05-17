const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', err => {
  if (err) throw err;
}
);


stdout.write('Hello, my friend! Tell me something, please:\n');
stdin.on('data', (data) => {
  const dataStr = data.toString().trim();
  if (dataStr === 'exit') {
    stdout.write('\nGood bye! Nice to see you!');
    process.exit();
  } else {
    fs.appendFile(filePath, data, (err) => {
      if (err) throw err;
    });
  }
});

process.stdin.resume();
process.on('SIGINT', () => {
  stdout.write('\nGood bye! Nice to see you!');
  process.exit(0);
});


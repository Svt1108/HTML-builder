const fs = require('fs');
const path = require('path');
//const readline = require('readline');
const { stdout, stdin } = process;

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', err => {
  if (err) throw err;
}
);


stdout.write("Hello, my friend! Tell me something, please:\n");
stdin.on("data", (data) => {
  const dataStr = data.toString().trim();
  if (dataStr === "exit") {
    stdout.write("\nGood bye! Nice to see you!");
    process.exit();
  } else {
    fs.appendFile(filePath, data, (err) => {
      if (err) throw err;
    });
  }
});

process.stdin.resume();
process.on("SIGINT", () => {
  stdout.write("\nGood bye! Nice to see you!");
  setTimeout(() => {
    process.exit(0);
  }, 1500);
});


/*
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
  setTimeout(() => {
    process.exit(0);
  }, 1500);
});                             */


/*
let writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});

rl.on('SIGINT', () => rl.close());
rl.on('close', () => {
  writeStream.end();
  writeStream.on('finish', () => {
    console.log(`\nGood bye!`);
  });

  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

const ask = () => {   
  rl.question('Input a new line: ', (answer) => {
    if (answer != 'exit') {
      writeStream.write(`${answer}\n`);
      ask();
    }
    else {
      stdout.write('\nGood bye!');
      rl.close();
    }
  });
};
ask();           
                                               */















/*

stdout.write('Hello, my friend! Tell me something, please: ');
stdin.on('data', data => {
  const dataStr = data.toString().trim();
  if(dataStr === 'exit' ) {
    stdout.write('\nGood bye!');
    process.exit();
  }
  else {
    fs.appendFile(filePath, data, err => {
      if (err) throw err;  });
  }
});



process.stdin.resume();
process.on('SIGINT', () =>{
  stdout.write('\nGood bye! Nice to see you!');
  process.exit();
});                                                              */

// process.on('exit', () => stdout.write('Good bye! Nice to see you!'));

// process.on( 'SIGINT', function () {
//   process.exitCode = 1;

// });

// process.on('exit', (data5) => stdout.write('Good bye! Nice to see you!' + data5));

// process.stdin.setRawMode(true);
// process.stdin.resume();
// process.on('SIGINT', function() {
//   console.log('Interrupted');
//   process.exit(5);
// });


// const read = readline.createInterface({
//     input: stdin,
//     output: stdout,
// });

// process.stdin.on('keypress', (chunk, key) => {
//   if(key && key.name === 'c' && key.ctrl) {
//     console.log('bye bye');
//  //   process.exit();
//   }
// });


// process.on('SIGTERM', function () {

//     server.end().then(() => {
//         console.log('Interrupted');
//         process.exit();
//     }).catch((err) => {
//         console.error(err);
//     });

// });

// process.stdin.resume();
// process.on('SIGKILL', function() {
//   console.log('Interrupted');
//   process.exit();
// });


// process.openStdin().on('keypress', function(chunk, key) {
//   if(key && key.name === 'c' && key.ctrl) {
//     console.log('bye bye');
//     process.exit();
//   }
// });



// process.on('SIGINT', () =>{
//     stdout.write('\nGood bye! Nice to see you!');
//     process.exit();
// });


//process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));
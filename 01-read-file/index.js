const fs = require('fs');
const path = require('path');
const { stdout, stderr } = process;

const filetxt = path.join(__dirname, 'text.txt');
const streamtxt = fs.createReadStream(filetxt, 'utf-8');

let text = '';

streamtxt.on('data', (chunk) => (text = text + chunk));
streamtxt.on('end', () => stdout.write(text));
streamtxt.on('error', (error) => stderr.write(error.message));

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const {stdout} = process;

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

stdout.write('Text something\n');
read.on('SIGINT', () => {
  stdout.write('Adios\n');
  read.close();
});
read.on('line', data => {
  if(data.toLowerCase() === 'exit'){
    output.end();
    stdout.write('Adios\n');
    read.close();
  }else{
    output.write(data + '\n');
  }
});


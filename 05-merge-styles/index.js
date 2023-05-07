const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'project-dist/bundle.css');
const fileStyles = path.join(__dirname, 'styles');
const writeFile =  fs.createWriteStream(folder);

fs.readdir(fileStyles, (err, files) => {
  if(err) throw err;
  files.forEach((file) => {
    const pathFile = path.join(fileStyles, file);
    fs.stat(pathFile, (err, stats) => {
      if(err) throw err;
      if(path.extname(file).slice(1) === 'css' && stats.isFile()) {
        const pathFile = path.join(fileStyles, file);
        const output = fs.createReadStream(pathFile, 'utf-8');
        output.pipe(writeFile);
        // output.on('data', chunk => writeFile.write(chunk));
        // output.on('error', error => console.log('Error', error.message));
      }
    });
  });
});

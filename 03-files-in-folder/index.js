const fs = require('fs');
const path = require('path');
const fold = path.join(__dirname, 'secret-folder');

function getFile(file, stats) {
  path.extname(file) == '' 
    ? console.log(`${path.basename(file)} - ${(stats.size / 1024).toFixed(2)}kb`)
    : console.log(`${path.basename(file)} - ${path.extname(file).slice(1)} - ${(stats.size / 1024).toFixed(2)}kb`);
}

function getFileData(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) throw err;
    files.forEach(function forFile(file) {
      const fold = path.join(folder, file);
      fs.stat(fold, (error, stats) => {
        if (error) {
          console.log(error);
        }else if (stats.isFile()){
          getFile(file, stats);
        }
      });
    });
  });
}
getFileData(fold);


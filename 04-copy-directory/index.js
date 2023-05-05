const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

function copyFolderData(currFolder, copyFolder) {
  fs.rm(copyFolder, { recursive: true, force: true } , (err) => {
    if (err) throw err;
    fs.mkdir(copyFolder, {recursive: true}, (err) => {
      if (err) throw err;
      fs.readdir(currFolder, (err, files) => {
        if (err) throw err;
        files.forEach(function copyFiles(file){
          const copyFile = path.join(copyFolder, file);
          const currFile = path.join(currFolder, file);
          fs.stat(currFile, (error, stats) => {
            if (error) {
              console.log(error);
            }else if (stats.isFile()){
              fs.copyFile(currFile, copyFile, (err) => {
                if (err) throw err;
                console.log('copy');
              });
            }else if(stats.isDirectory()){
              copyFolderData(currFile, copyFile);
            }
          });
        });
      });
    });
  });
  
}
copyFolderData(folder, folderCopy);


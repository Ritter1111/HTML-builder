const fs2 = require('node:fs');
const fs = require('node:fs/promises');
const path = require('path');
const folderAssets = path.join(__dirname, 'assets');
const folderCreate = path.join(__dirname, 'project-dist/assets');
const folder = path.join(__dirname, 'project-dist', 'style.css');
const fileStyles = path.join(__dirname, 'styles');

async function createFile(path) {
  return fs2.createWriteStream(path);
}

async function createFolder(folderCreate) {
  return fs2.mkdir(folderCreate, {recursive: true}, (err) => {
    if (err) { 
      throw err;
    }
  });
}

async function copyFolderData(currFolder, copyFolder) {
  await fs.rm(copyFolder, { recursive: true, force: true });
  await createFolder(copyFolder);

  const files = await fs.readdir(currFolder);

  for await (const file of files) {
  
    const copyFile = path.join(copyFolder, file);
    const currFile = path.join(currFolder, file);
    const stats = await fs.stat(currFile);

    if (stats.isFile()) {
      await fs.copyFile(currFile, copyFile);      
    } else if(stats.isDirectory()) {
      await createFolder(copyFile);
      await copyFolderData(currFile, copyFile);
    }
  }
}

async function mergeStyles(writeFile) {
  const files  = await fs.readdir(fileStyles);

  for await (const file of files) {
    const pathFile = path.join(fileStyles, file);
    const stats = await fs.stat(pathFile);

    if(path.extname(file).slice(1) === 'css' && stats.isFile()){
      const pathFile = path.join(fileStyles, file);
      const output = fs2.createReadStream(pathFile, 'utf-8');
      output.pipe(writeFile, {end: false});
    }
  }
}

async function buildPage(currfile, copyFile) {
  await createFolder(copyFile);
  const index = path.join(copyFile, 'index.html');
  const files = await fs.readFile(currfile, 'utf-8');
  await fs.writeFile(index, files);

  let read = await fs.readFile(index, 'utf-8');
  const items = read.match(/\{\{[\w\s]+\}\}/g);

  for(let item of items) {
    const tagValue = item.slice(2,-2).trim();
    const articlePath = path.join(__dirname, 'components', `${tagValue}.html`);
    const readHeader = await fs.readFile(articlePath, 'utf-8');
    read = read.replace(item, readHeader);
  }
  await fs.writeFile(index, read);
}

(async () => {
  await createFolder(folderCreate);
  await copyFolderData(folderAssets, folderCreate);
  const stream = await createFile(folder);
  await mergeStyles(stream);
  await buildPage(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist'));
})();


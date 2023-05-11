const path = require('path');
const fs = require('fs');

//текущие папки
const pathToAssets = path.resolve(__dirname, 'assets');
const pathToComponentsDir = path.resolve(__dirname, 'components');
const pathToStylesDir = path.resolve(__dirname, 'styles');

//создание новых папок
const pathToProjectDistDir = path.resolve(__dirname, 'project-dist');
const pathToAssetsDistDir = path.resolve(__dirname, 'project-dist', 'assets');

fs.mkdir(pathToProjectDistDir, {recursive: true}, err => {
  if (err) throw err;
});
fs.mkdir(pathToAssetsDistDir, {recursive: true}, (err) => {
  if (err) throw err;
});

//создание файла css

const pathToCssFile = path.resolve(pathToProjectDistDir, 'style.css');

let data = '';

fs.writeFile(pathToCssFile, '', err => {
  if (err) throw err;
});

fs.readdir(pathToStylesDir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    let fileToCopy = path.resolve(pathToStylesDir, file.name);
    let fileType = path.parse(fileToCopy).ext;

    if (file.isDirectory() || fileType !== '.css') {
      continue;

    } else if (file.isFile() && fileType === '.css') {
      const readStream = fs.createReadStream(fileToCopy, 'utf-8');

      readStream.on('data', chunk => data += chunk);
      readStream.on('end', () => fs.writeFile(pathToCssFile, data, err => {
        if (err) throw err;
      }));
    }
  }
});

//создание копии папки assets

function copyDir (originDir, destinationDir, destinationDirName) {
  const pathToDestinationDir = path.resolve(destinationDir, destinationDirName);
  fs.mkdir(pathToDestinationDir, {recursive: true}, (err) => {
    if (err) throw err;
  });

  fs.readdir(pathToDestinationDir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      if (file.isFile()) {
        fs.unlink(path.resolve(pathToDestinationDir, file.name), err => {
          if (err) throw err;
        });
      }
    }
  });

  fs.readdir(originDir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      if (file.isFile()) {
        fs.copyFile(path.resolve(originDir, file.name), path.resolve(pathToDestinationDir, file.name), err => {
          if (err) throw err;
        });
      }
    }
  });
}

copyDir(path.resolve(pathToAssets, 'fonts'), pathToAssetsDistDir, 'fonts');
copyDir(path.resolve(pathToAssets, 'img'), pathToAssetsDistDir, 'img');
copyDir(path.resolve(pathToAssets, 'svg'), pathToAssetsDistDir, 'svg');

//создание файла index.html

const pathToOriginHTML = path.resolve(__dirname, 'template.html');
const pathToDestinationHTML = path.resolve(__dirname, 'project-dist', 'index.html');

const readStream = fs.createReadStream(pathToOriginHTML, 'utf8');

readStream.on('data', (data) => {
  let dataHTML = data.toString();

  fs.readdir(path.resolve(pathToComponentsDir), {withFileTypes: true}, (err, files) => {
    if(err) throw err;

    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      let fileExt = path.parse(fileName).ext;

      if (files[i].isFile() && fileExt === '.html') {
        let readOriginHTML = fs.createReadStream(path.resolve(pathToComponentsDir, fileName));

        readOriginHTML.on('data', (chunk) => {
          dataHTML = dataHTML.replaceAll(`{{${path.parse(fileName).name}}}`, chunk.toString());

          if ( i === files.length - 1 ) {
            fs.createWriteStream(pathToDestinationHTML).write(dataHTML);
          }
        });
      }
    }
  });
});
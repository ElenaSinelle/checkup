const path = require('path');
const fs = require('fs');

const originDir = path.resolve(__dirname, 'files');
const destinationDir = path.resolve(__dirname, 'files-copy');

fs.mkdir(destinationDir, {recursive: true}, (err) => {
  if (err) throw err;
});

fs.readdir(destinationDir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (file.isFile()) {
      fs.unlink(path.join(destinationDir, file.name), err => {
        if (err) throw err;
      });
    }
  }
});

fs.readdir(originDir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (file.isFile()) {
      fs.copyFile(path.join(originDir, file.name), path.join(destinationDir, file.name), err => {
        if (err) throw err;
      });
    }
  }
});
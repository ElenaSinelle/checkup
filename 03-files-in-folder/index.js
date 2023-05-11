const fs = require('fs');
const path = require('path');

const pathToSecretDir = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathToSecretDir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  for (let file of files) {
    if (file.isFile()) {
      let pathToFile = path.resolve(__dirname, 'secret-folder', file.name)
      let fileInfo = path.parse(pathToFile);

      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;

        console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${stats.size} bytes`);
      });
    }
  }
});

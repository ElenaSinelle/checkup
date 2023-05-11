const path = require('path');
const fs = require('fs');

const pathToBundleFile = path.resolve(__dirname, 'project-dist', 'bundle.css');
const pathToStylesDir = path.resolve(__dirname, 'styles');

let data = '';

fs.writeFile(pathToBundleFile, '', err => {
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
      readStream.on('end', () => fs.writeFile(pathToBundleFile, data, err => {
        if (err) throw err;
      }));
    }
  }
});




const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

stdout.write('Привет! Как тебя зовут?\n');

const outputFile = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

stdin.on ('data', data => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    exitProgram();
  }
  outputFile.write(data);
  stdout.write('Расскажи, как твои дела?\nДля выхода из программы нажми Ctrl + C или напиши exit.\n(Если не сработает Ctrl + C, проверь задание в powershell, пожалуйста;)\n');
});

process.on('SIGINT', () => {
  exitProgram();
});

function exitProgram() {
  stdout.write('Спасибо! Надеюсь, тебе всё понравилось! :))) \n');
  process.exit();
}

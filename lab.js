
const { program } = require('commander');
const fs = require('fs');
function Inputtype() {
  
  program
    .option("-i, --input <value>", "input file path")
    .option("-o, --output <value>", "Output file path")
    .option("-d, --display", "Output display");

  // Парсинг параметрів
  program.parse();
  const options = program.opts();

  
  if (!options.input) {
    throw new Error("Please, specify input file");
  }

  
  if (!fs.existsSync(options.input)) {
    throw new Error("Cannot find input file");
  }

  // Читання вхідного файлу
  const inputData = fs.readFileSync(options.input, 'utf-8');
  return [options, inputData];
}

// Функція для обробки вихідних даних: вивід у консоль або запис у файл
function processOutput(options, outputData) {
  
  if (options.output) {
    fs.writeFileSync(options.output, outputData);
  }

  
  if (options.display) {
    console.log(outputData);
  }

  
  if (!options.output && !options.display) {
    console.log("");
  }
}

function main() {
  
  const [options, inputData] = Inputtype();

  
  const jsonData = JSON.parse(inputData);


  let outputData = '';
  jsonData.forEach(entry => {
    if (entry.date && entry.rate) {
      outputData += `${entry.date}:${entry.rate}\n`;
    }
  });

  processOutput(options, outputData.trim());
}
main();

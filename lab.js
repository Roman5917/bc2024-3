const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'Input file path (JSON with currency rates)')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --display', 'Display result in console')
  .parse(process.argv);

const options = program.opts();

// Перевірка наявності обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка наявності файлу
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Читання даних з файлу
let data;
try {
  data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
  console.log('Data read from file:', data); // Додано для перевірки
} catch (error) {
  console.error('Error reading or parsing the input file:', error);
  process.exit(1);
}

// Перевірка формату даних
if (!Array.isArray(data)) {
  console.error('Input data is not in the expected format');
  process.exit(1);
}

// Витягнення курсів валют
let output = '';
data.forEach(entry => {
  if (entry.date && entry.rate) {
    output += `${entry.date}:${entry.rate}\n`;
  }
});

// Виведення результату
if (options.display) {
  if (output.trim()) {
    console.log(output.trim());
  } else {
    console.log('No currency rates found in the input file.');
  }
}

// Запис у файл, якщо вказано
if (options.output) {
  fs.writeFileSync(options.output, output.trim(), 'utf-8');
}

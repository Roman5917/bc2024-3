// Імпорт бібліотеки для роботи з командним рядком
const { program } = require('commander');
// Імпорт бібліотеки для роботи з файлами
const fs = require('fs');

// Функція для обробки параметрів командного рядка та читання вхідного файлу
function handleInput() {
  // Опис параметрів програми
  program
    .option("-i, --input <value>", "Шлях до \"вхідного\" файлу")
    .option("-o, --output <value>", "Шлях до \"вихідного\" файлу") // Прибрали значення за замовчуванням
    .option("-d, --display", "Чи відображати вихідні дані одразу у консоль");

  // Парсинг параметрів
  program.parse();
  const options = program.opts();

  // Перевірка наявності обов'язкового параметра вхідного файлу
  if (!options.input) {
    throw new Error("Please, specify input file");
  }

  // Перевірка існування файлу
  if (!fs.existsSync(options.input)) {
    throw new Error("Cannot find input file");
  }

  // Читання вхідного файлу
  const inputData = fs.readFileSync(options.input, 'utf-8');
  return [options, inputData];
}

// Функція для обробки вихідних даних: вивід у консоль або запис у файл
function processOutput(options, outputData) {
  // Якщо вказано параметр для запису у файл
  if (options.output) {
    fs.writeFileSync(options.output, outputData);
  }

  // Якщо вказано параметр для виведення у консоль
  if (options.display) {
    console.log(outputData);
  }

  // Якщо жоден з параметрів не вказано
  if (!options.output && !options.display) {
    console.log("");
  }
}

// Головна функція програми
function main() {
  // Отримання параметрів та вхідних даних
  const [options, inputData] = handleInput();

  // Парсинг JSON з вхідного файлу
  const jsonData = JSON.parse(inputData);

  // Формування рядка для виведення курсів валют у форматі "дата:курс"
  let outputData = '';
  jsonData.forEach(entry => {
    if (entry.date && entry.rate) {
      outputData += `${entry.date}:${entry.rate}\n`;
    }
  });

  // Обробка виведення результатів
  processOutput(options, outputData.trim());
}

// Запуск головної функції
main();

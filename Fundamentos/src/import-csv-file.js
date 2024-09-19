import fs from 'fs';
import { parse } from 'csv-parse';
import axios from 'axios';

const csvFilePath = new URL('../tasks.csv', import.meta.url).pathname;

async function importCSV(filePath) {
  try {
    const parser = fs.createReadStream(filePath).pipe(parse({
      columns: true,
      skip_empty_lines: true,
    }));
  
    for await (const record of parser) {
      try {
        await axios.post('http://localhost:3333/tasks', {
          title: record.title,
          description: record.description
        });
      } catch (error) {
        console.error(`Erro ao criar task: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Erro ao importar CSV:', error);
  }
}

importCSV(csvFilePath);

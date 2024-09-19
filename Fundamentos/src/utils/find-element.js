import { Database } from '../database.js';

const database = new Database();

export function findElement(table, id) {
  const tasks = database.select(table, null);
  const task = tasks.find(row => row.id === id);

  return task;
}
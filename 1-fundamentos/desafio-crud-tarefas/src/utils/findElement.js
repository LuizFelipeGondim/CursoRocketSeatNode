export function findElement(database, table, id) {
  const elements = database.select(table, null);

  return elements.find(row => row.id === id);
}
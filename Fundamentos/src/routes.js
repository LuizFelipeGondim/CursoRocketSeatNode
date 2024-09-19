import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { findElement } from './utils/find-element.js';
import { NotFoundError, BadRequestError } from './utils/error-classes.js'

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        title
      } : null);

		  return res.end(JSON.stringify(tasks));
    } 
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        
        if (!req.body || !req.body.title || !req.body.description) {
          throw new BadRequestError("O titulo ou a descricao nao foram informados!");
        }

        const { title, description } = req.body;

        const date = new Date().toLocaleDateString('pt-br');
  
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: date,
          updated_at: date
        };
  
        database.insert('tasks', task);
  
        return res.writeHead(201).end();

      } catch (error){
        return res.writeHead(error.statusCode, { 'Content-Type': 'text/plain' }).end(error.message);
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const task = findElement('tasks', id);
        
        if (!task) {
          throw new NotFoundError('Task nao encontrada!');
        }

        if (!req.body || !req.body.title || !req.body.description) {
          throw new BadRequestError("O titulo ou a descricao nao foram informados!");
        }

        const { title, description } = req.body;
  
        const date = new Date().toLocaleDateString('pt-br');
  
        database.update('tasks', id, {
          title,
          description,
          updated_at: date
        });
  
        return res.writeHead(204).end();

      } catch (error) {
        return res.writeHead(error.statusCode || 500, { 'Content-Type': 'text/plain' }).end(error.message);
      }
    } 
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const task = findElement('tasks', id);

        if (!task) {
          throw new NotFoundError('Task nao encontrada!');
        }

        const date = new Date().toLocaleDateString('pt-br');
  
        database.update('tasks', id, {
          completed_at: date
        });

        return res.writeHead(204).end();

      } catch (error) {
        return res.writeHead(error.statusCode || 500, { 'Content-Type': 'text/plain' }).end(error.message);
      }
    } 
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {

        const { id } = req.params;
        const task = findElement('tasks', id);

        if (!task) {
          throw new NotFoundError('Task nao encontrada!');
        }
  
        database.delete('tasks', id);
  
        return res.writeHead(204).end();

      } catch (error) {
        return res.writeHead(error.statusCode, { 'Content-Type': 'text/plain' }).end(error.message);
      }
    } 
  }
];
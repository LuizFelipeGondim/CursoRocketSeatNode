import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { findElement } from './utils/findElement.js';

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", search ? {
        title: search,
        description: search
      } : null);

      return res.end(JSON.stringify(tasks));
    }
  }, {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      let statusCode = 201;
      
      try {
        if (!req.body || !req.body.title || !req.body.description) {
          statusCode = 400;
          throw new Error("O titulo ou a descricao nao foram informados!");
        }

        const id = randomUUID();
        const { title, description } = req.body;
        const date = new Date().toLocaleDateString('pt-br');
  
        const task = {
          id,
          title,
          description,
          completed_at: null,
          created_at: date,
          updated_at: date
        };
  
        database.insert("tasks", task);
  
        return res.writeHead(statusCode).end();
      } catch (err) {
        res.writeHead(statusCode).end(err.message);
      }
    }
  }, {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      let statusCode = 204;
      
      try {
        if (!req.body || !req.body.title || !req.body.description) {
          statusCode = 400;
          throw new Error("O titulo ou a descricao nao foram informados!");
        } 

        const { id } = req.params;
        const task = findElement(database, "tasks", id);

        if(!task) {
          statusCode = 404;
          throw new Error("Task nao encontrada!");
        }

        const { title, description } = req.body;
        const date = new Date().toLocaleDateString('pt-br');

        database.update("tasks", id, {
          title,
          description,
          updated_at: date
        });

        res.writeHead(statusCode).end();

      } catch (err) {
        res.writeHead(statusCode).end(err.message);
      }
    }
  }, {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      let statusCode = 204;
      
      try {
        const { id } = req.params;
        const task = findElement(database, "tasks", id);
  
        if(!task) {
          statusCode = 404;
          throw new Error("Task nao encontrada!");
        }

        const date = new Date().toLocaleDateString('pt-br');

        database.update("tasks", id, {
          completed_at: !task.completed_at ? date : null,
          updated_at: date
        });

        res.writeHead(statusCode).end();

      } catch (err) {
        res.writeHead(statusCode).end(err.message);
      }
    }
  }, {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
       try {
        let statusCode = 204;

        const { id } = req.params;
        const task = findElement(database, "tasks", id);
  
        if(!task) {
          statusCode = 404;
          throw new Error("Task nao encontrada!");
        }

        database.delete("tasks", id);

        res.writeHead(statusCode).end();

      } catch (err) {
        res.writeHead(statusCode).end(err.message);
      }
    }
  }
];


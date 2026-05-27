import { pool } from './database.js';
import { TodoEvent } from 'shared';

export async function saveTodo(todo: TodoEvent): Promise<void> {
  const query = `
    INSERT INTO todos (id, correlation_id, title, message, created_at)
    VALUES ($1, $2, $3, $4, $5)
  `;
  
  const values = [
    todo.id,
    todo.correlationId,
    todo.title,
    todo.message,
    todo.createdAt,
  ];

  try {
    await pool.query(query, values);
    console.log(`[Service A] Saved todo to database | id=${todo.id} | correlationId=${todo.correlationId}`);
  } catch (error) {
    console.error('[Service A] Failed to save todo to database:', error);
    throw error;
  }
}

export async function getTodoById(id: string): Promise<TodoEvent | null> {
  const query = 'SELECT * FROM todos WHERE id = $1';
  
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      correlationId: row.correlation_id,
      title: row.title,
      message: row.message,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error('[Service A] Failed to get todo from database:', error);
    throw error;
  }
}

export async function getAllTodos(): Promise<TodoEvent[]> {
  const query = 'SELECT * FROM todos ORDER BY created_at DESC';
  
  try {
    const result = await pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      correlationId: row.correlation_id,
      title: row.title,
      message: row.message,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('[Service A] Failed to get todos from database:', error);
    throw error;
  }
}

import { getDriver } from './database.js';
import { TodoEvent } from 'shared';

export async function createTodoNode(todo: TodoEvent): Promise<void> {
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.run(
      `
      CREATE (t:Todo {
        id: $id,
        correlationId: $correlationId,
        title: $title,
        message: $message,
        createdAt: datetime($createdAt),
        consumedAt: datetime()
      })
      RETURN t
      `,
      {
        id: todo.id,
        correlationId: todo.correlationId,
        title: todo.title,
        message: todo.message,
        createdAt: todo.createdAt,
      }
    );

    console.log(
      `[Service C] Created todo node in Neo4j | id=${todo.id} | correlationId=${todo.correlationId}`
    );
  } finally {
    await session.close();
  }
}

export async function getTodoNodeById(id: string): Promise<TodoEvent | null> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (t:Todo {id: $id}) RETURN t',
      { id }
    );

    if (result.records.length === 0) {
      return null;
    }

    const node = result.records[0].get('t');
    return {
      id: node.properties.id,
      correlationId: node.properties.correlationId,
      title: node.properties.title,
      message: node.properties.message,
      createdAt: node.properties.createdAt,
    };
  } finally {
    await session.close();
  }
}

export async function getAllTodoNodes(): Promise<TodoEvent[]> {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (t:Todo) RETURN t ORDER BY t.createdAt DESC'
    );

    return result.records.map((record) => {
      const node = record.get('t');
      return {
        id: node.properties.id,
        correlationId: node.properties.correlationId,
        title: node.properties.title,
        message: node.properties.message,
        createdAt: node.properties.createdAt,
      };
    });
  } finally {
    await session.close();
  }
}

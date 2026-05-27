import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

export async function connectDatabase(): Promise<void> {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'todopassword';

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  // Verify connectivity
  await driver.verifyConnectivity();
  console.log('[Service C] Neo4j database connected');
}

export async function disconnectDatabase(): Promise<void> {
  if (driver) {
    await driver.close();
    console.log('[Service C] Neo4j database disconnected');
  }
}

export function getDriver(): Driver {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call connectDatabase() first.');
  }
  return driver;
}

import { Kafka, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-final-consumer',
  brokers: ['localhost:9092'],
});

export const consumer: Consumer = kafka.consumer({ groupId: 'todo-consumer-group' });

export async function connectConsumer() {
  await consumer.connect();
  console.log('[Service C] Kafka consumer connected');
}

export async function disconnectConsumer() {
  await consumer.disconnect();
  console.log('[Service C] Kafka consumer disconnected');
}

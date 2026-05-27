import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-producer',
  brokers: ['localhost:9092'],
});

export const producer: Producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('[Service A] Kafka producer connected');
}

export async function disconnectProducer() {
  await producer.disconnect();
  console.log('[Service A] Kafka producer disconnected');
}

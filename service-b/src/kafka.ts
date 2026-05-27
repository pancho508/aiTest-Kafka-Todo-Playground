import { Kafka, Producer, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-transformer',
  brokers: ['localhost:9092'],
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'todo-middleman-group' });

export async function connectKafka() {
  await producer.connect();
  await consumer.connect();
  console.log('[Service B] Kafka producer and consumer connected');
}

export async function disconnectKafka() {
  await consumer.disconnect();
  await producer.disconnect();
  console.log('[Service B] Kafka disconnected');
}

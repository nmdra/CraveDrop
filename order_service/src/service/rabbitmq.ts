// rabbitmq.ts
import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://rabbitmq:5672'); // rabbitmq is your Docker service name
    channel = await connection.createChannel();
    await channel.assertExchange('order_exchange', 'topic', { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
};

export const publishOrderPlaced = async (orderData: any) => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }

  const message = Buffer.from(JSON.stringify(orderData));
  channel.publish('order_exchange', 'order.placed', message);
  console.log('📤 Order placed message sent to RabbitMQ');
};

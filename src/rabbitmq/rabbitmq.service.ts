import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  constructor(
    private connection: amqp.Connection,
    private channel: amqp.Channel,
  ) {}

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBIT_MQ);
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async sendToQueue(queue: string, message: any) {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  private async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

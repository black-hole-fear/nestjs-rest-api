import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private client: ClientProxy;

    onModuleInit() {
        this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URI],
            queue: 'main_queue',
            queueOptions: {
            durable: false,
            },
        },
        });
    }

    async send(pattern: string, data: any) {
        return this.client.send(pattern, data).toPromise();
    }

    onModuleDestroy() {
        this.client.close();
    }
}

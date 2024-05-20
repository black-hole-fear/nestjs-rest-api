import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot("mongod://localhost:27017/nest")
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
      .timeout(4000);
  });

  it('/api/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'Test User', job: 'Developer' })
      .expect(201)
      .timeout(5000)
  });

  it('GET api/users/:userId', () => {
    return request(app.getHttpServer())
      .get('/api/users/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1);
    });
  })

  it('/GET api/user/:userId/avatar', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/user/1/avatar')
      .expect(200);

    expect(res.body).toBeInstanceOf(Object);
  });

  it('/DELETE api/user/:userId/avatar', () => {
    return request(app.getHttpServer())
      .delete('/api/user/1/avatar')
      .expect(200)
      .expect({ message: 'Avatar deleted successfully' });
  });

  afterAll(async () => {
    await app.close();
  })
});

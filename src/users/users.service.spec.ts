import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'Test User', job: 'Developer' })
      .expect(201)
      .then((response) => {
        expect(response.body.name).toBe('Test User');
        expect(response.body.job).toBe('Developer');
      });
  });

  it('/api/user/:userId (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/user/2')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(2);
        expect(response.body.email).toBeDefined();
      });
  });

  it('/api/user/:userId/avatar (GET)', async () => {
    const userId = '2';
    const response = await request(app.getHttpServer()).get(`/api/user/${userId}/avatar`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('/api/user/:userId/avatar (DELETE)', async () => {
    const userId = '2';
    await request(app.getHttpServer()).delete(`/api/user/${userId}/avatar`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

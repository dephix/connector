import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('GET /ticks (e2e-lite)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = mod.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should require exchangeId and symbol', async () => {
    const res = await request(app.getHttpServer()).get('/ticks').expect(200);
    expect(res.body).toHaveProperty('error');
  });
});

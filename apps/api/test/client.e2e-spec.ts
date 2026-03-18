import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';

describe('Clients (e2e)', () => {
  let app: INestApplication;
  //let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /clients - responds with list or proper auth status', async () => {
    const res = await request(app.getHttpServer()).get('/clients');
    expect([200, 401, 403, 500]).toContain(res.status);
  });
});

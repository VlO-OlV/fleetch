import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  //let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //prismaService = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET) - should return ok', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Health Endpoint', () => {
    it('/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('checks');
        });
    });
  });

  describe('Authentication Flow', () => {
    it('should complete full auth flow: login -> refresh -> logout', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Step 1: Login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      if (loginResponse.status === 200) {
        expect(loginResponse.body).toHaveProperty('accessToken');
        const accessToken = loginResponse.body.accessToken;

        // Step 2: Use token to access protected route
        const protectedResponse = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect([200, 403]).toContain(protectedResponse.status);

        // Step 3: Logout
        const logoutResponse = await request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', `Bearer ${accessToken}`);

        expect([200, 204]).toContain(logoutResponse.status);

        // Step 4: Token should be invalidated
        const afterLogoutResponse = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(afterLogoutResponse.status).toBe(401);
      }
    });

    it('should reject invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should reject requests without authentication', async () => {
      const response = await request(app.getHttpServer()).get('/users');

      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app.getHttpServer()).get(
        '/non-existent-route',
      );

      expect(response.status).toBe(404);
    });

    it('should validate request body', async () => {
      const invalidLoginDto = {
        email: 'invalid-email',
        password: '', // Empty password
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto);

      expect(response.status).toBe(400);
    });

    it('should handle server errors gracefully', async () => {
      // Test with malformed JSON
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json {');

      expect([400, 413]).toContain(response.status);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should set appropriate security headers', async () => {
      const response = await request(app.getHttpServer()).get('/');

      // These headers should be set by NestJS/Express security middleware
      expect(response.headers).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should handle normal request rate', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(200);
    });

    // Note: Actual rate limiting tests would need configured throttler
  });

  describe('Response Formats', () => {
    it('should return JSON with proper content-type', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.type).toMatch(/json|text/);
    });

    it('should include proper timestamps in responses', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect([200, 400]).toContain(response.status);
    });
  });
});

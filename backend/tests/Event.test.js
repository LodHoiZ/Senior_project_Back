const { authController } = require('../controllers');
const request = require('supertest');
const app = require('../app');
const db = require('../models');
const bcryptjs = require('bcryptjs');

describe('GET /veevi-test', () => {
  // it('should return "Hello World"', async () => {
  //   const response = await request(app).get('/veevi-test');
  //   expect(response.status).toBe(200);
  //   expect(response.text).toBe('Hello World');
  // });
});

// describe('POST /auth/login', () => {
//   beforeAll(async () => {
//     const salt = bcryptjs.genSaltSync(10);
//     const hashedPassword = bcryptjs.hashSync('Ss123456', salt);

//     const thisInstance = await db.User.create({
//       email: 'council@council.com',
//       password: hashedPassword,
//       salt,
//     });
//   });

//   console.log('Veevi',thisInstance )

// //   afterAll(async () => {
// //     // Clean up test data
// //     await db.User.destroy({ where: { email: 'asd@gmail.com' } });
// //     await db.sequelize.close();
// //   });

//   it('should return access_token and refresh_token on successful login', async () => {
//     const response = await request(app)
//       .post('/auth/login')
//       .send({ email: 'council@council.com', password: 'Ss123456' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('access_token');
//     expect(response.body).toHaveProperty('refresh_token');
//   });

// //   it('should fail with incorrect password', async () => {
// //     const response = await request(app)
// //       .post('/auth/login')
// //       .send({ email: 'asd@gmail.com', password: 'wrongpassword' });

// //     expect(response.status).toBe(401);
// //     expect(response.body).not.toHaveProperty('access_token');
// //     expect(response.body).not.toHaveProperty('refresh_token');
// //   });

// //   it('should fail with non-existent user', async () => {
// //     const response = await request(app)
// //       .post('/auth/login')
// //       .send({ email: 'nonexistent@gmail.com', password: '123456' });

// //     expect(response.status).toBe(404);
// //     expect(response.body).not.toHaveProperty('access_token');
// //     expect(response.body).not.toHaveProperty('refresh_token');
// //   });
// });

describe('POST /auth/login', () => {
    // beforeAll(async () => {
    //   // Synchronize the database schema
    //   await db.sequelize.sync({ force: true });
  
    //   // Setup test data
    //   const salt = bcryptjs.genSaltSync(10);
    //   const hashedPassword = bcryptjs.hashSync('Ss123456', salt);
  
    //   try {
    //     await db.User.create({
    //       email: 'council@admin.admin',
    //       password: "Ss123456"
    //     });
    //   } catch (error) {
    //     console.error('Error creating user:', error);
    //   }
    // });

    it('should return access_token and refresh_token', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ username: 'council@admin.admin', password: 'Ss123456' });

          console.log(response)
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      });
  
    // afterAll(async () => {
    //   // Clean up test data
    //   try {
    //     await db.User.destroy({ where: { email: 'asd@gmail.com' } });
    //   } catch (error) {
    //     console.error('Error deleting user:', error);
    //   }
  
    //   await db.sequelize.close();
    // });
  
    // it('should return access_token and refresh_token on successful login', async () => {
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({ email: 'asd@gmail.com', password: '123456' });
  
    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('access_token');
    //   expect(response.body).toHaveProperty('refresh_token');
    // });
  
    // it('should fail with incorrect password', async () => {
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({ email: 'asd@gmail.com', password: 'wrongpassword' });
  
    //   expect(response.status).toBe(401);
    //   expect(response.body).not.toHaveProperty('access_token');
    //   expect(response.body).not.toHaveProperty('refresh_token');
    // });
    it('input wrong email should not return access_token and refresh_token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'nonexistent@gmail.com', password: 'Ss123456' });

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('access_token');
      expect(response.body).not.toHaveProperty('refresh_token');
    });

    it('input wrong password should not return access_token and refresh_token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'council@admin.admin', password: 'InvalidPasswordBlahBlah' });
  
      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('access_token');
      expect(response.body).not.toHaveProperty('refresh_token');
    });

    it('input wrong password and wrong email should not return access_token and refresh_token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'nonexistent@gmail.com', password: 'InvalidPasswordBlahBlah' });
  
      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('access_token');
      expect(response.body).not.toHaveProperty('refresh_token');
    });
  
    // it('should fail with non-existent user', async () => {
    //   const response = await request(app)
    //     .post('/auth/login')
    //     .send({ email: 'nonexistent@gmail.com', password: '123456' });
  
    //   expect(response.status).toBe(404);
    //   expect(response.body).not.toHaveProperty('access_token');
    //   expect(response.body).not.toHaveProperty('refresh_token');
    // });
  });

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '..';
import User from '../models/users';
import { authMethods } from '../middlewares/auth';

describe('POST /register/', () => {
  afterAll(async () => {
    // Disconnect from the test database after running the tests
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Remove all users from the test database after each test
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/register/')
      .send(user)
      .expect(200);

    expect(response.body.email).toBe(user.email);

    const dbUser = await User.findOne({ email: user.email });
    expect(dbUser).toBeDefined();
    expect(dbUser!.password).not.toBe(user.password); // Check that the password was hashed
  });

  it('should return an error if user data is invalid', async () => {
    // Test invalid user data
    const user = {
      name: 'John Doe',
      email: 'Invalid-email',
      password: 'password',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body.errors).toBe('Invalid Data Format');
  });
});

describe('POST /login/', () => {
  beforeAll((done) => {
    const mongoUrl = process.env.MONGO_URL as string;
    mongoose.connect(mongoUrl, {
    }).then(() => {
      console.log('DB connected');
    }).catch((err) => {
      console.error('DB connection failed', err);
    })
      .then(() => {
        console.log('DB connected');
        // Create a test user in the database
        User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: authMethods.hashPassword('password'),
        }).then(() => done());
      })
      .catch((err) => {
        console.error(err);
        done.fail('DB connection failed');
      });
  });

  afterAll(async () => {
    // Disconnect from the test database after running the tests
    await mongoose.connection.close();
  });

  it('should log in a user with valid credentials', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/login/')
      .send(user)
      .expect(200);

    expect(response.body.email).toBe(user.email);
    expect(response.body.token).toBeDefined();
  });

  it('should return an error if the user does not exist', async () => {
    const user = {
      email: 'nonexistent@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/login/')
      .send(user)
      .expect(500);

    expect(response.text).toBe('{"Error massage":"User not found"}');
  });

  it('should return an error if the password is incorrect', async () => {
    const user = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/login/')
      .send(user)
      .expect(401);

    expect(response.text).toBe('{"Error massage":"Invalid email or password"}');
  });

  it('should return an error if the email is missing', async () => {
    const user = {
      password: 'password',
    };

    const response = await request(app)
      .post('/login/')
      .send(user)
      .expect(400);

    expect(response.text).toBe('{"Error massage":"Email is required"}');
  });

  it('should return an error if the password is missing', async () => {
    const user = {
      email: 'test@example.com',
    };

    const response = await request(app)
      .post('/login/')
      .send(user)
      .expect(400);

    expect(response.text).toBe('{"Error massage":"Password is required"}');
  });
});

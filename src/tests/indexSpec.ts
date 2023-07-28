/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '..';
import User from '../models/users';

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

/* eslint-disable no-console */
import {
  Request, Response, NextFunction,
} from 'express';

const errorFunction = (err:Error, req: Request, res: Response, next: NextFunction) => {
//   console.log(`err.message *${err.message}*`);
//   console.log(err.stack);

  if (err.message.substring(0, 6) === 'E11000') {
    // error from mongo (duplicated value)
    res.status(400).json({ Error: 'A user with the same data already exists' });
  } else if (err.message.substring(0, 35) === 'Cannot read properties of undefined') {
    res.status(400).json({ 'Error massage': 'Please enter the required data' });
  } else if (err.message === '1') {
    res.status(400).json({ 'Error massage': 'A user with the same email already exists' });
  } else if (err.message === '2') {
    res.status(401).json({ 'Error massage': 'Invalid email or password' });
  } else if (err.message === '3') {
    res.status(400).json({ 'Error massage': 'Invalid Role' });
  } else if (err.message === '4') {
    res.status(400).json({ 'Error massage': 'Failed to create user' });
  } else if (err.message === '5') {
    res.status(500).json({ 'Error massage': 'User not found' });
  } else if (err.message === '6') {
    res.status(400).json({ 'Error massage': 'Missing required fields' });
  } else if (err.message === '7') {
    res.status(400).json({ 'Error massage': 'Email is required' });
  } else if (err.message === '8') {
    res.status(400).json({ 'Error massage': 'Password is required' });
  } else {
    console.log(`Unexpected error: ${err.message}`);
    console.log(err.stack);
    res.status(500).json({ 'Error massage': 'Something went wrong' });
  }
  next();
};

// high level Error wrapper function
const errorHandling = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorFunction, errorHandling };

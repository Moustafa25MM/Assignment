/* eslint-disable import/no-extraneous-dependencies */
import { body } from 'express-validator';

const checkEmail = body('email')
  .isString()
  .isEmail()
  .withMessage('Email is not an email')
  .normalizeEmail()
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Email is required')
  .isLength({ min: 5, max: 255 })
  .withMessage('Email: must be at least 5 chars long & maximum 255 chars');

const checkName = body('name')
  .isString()
  .exists({ checkFalsy: false })
  .withMessage('name is required')
  .trim()
  .isLength({ min: 5, max: 50 })
  .withMessage('name: must be at least 3 chars long & maximum 50 chars');

const checkPassowrd = body('password')
  .exists({ checkFalsy: true })
  .withMessage('Password is required')
  .trim()
  .isLength({ min: 5, max: 1024 })
  .withMessage('Password: must be at least 5 chars longs');

export const validations = {
  checkEmail,
  checkName,
  checkPassowrd,
};

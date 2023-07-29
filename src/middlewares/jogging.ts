/* eslint-disable max-len */
import { NextFunction } from 'express';
import Jogging from '../models/jogging';

export const createJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== 'regular' && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized access' });
    }
    const { date, distance, time } = req.body;

    if (!date || !distance || !time) {
      return res.status(400).send({ message: 'The jogging data is missing fields' });
    }

    const jogging = new Jogging({
      date,
      distance,
      time,
      createdBy: req.user.id,
    });

    const savedJogging = await jogging.save();

    res.locals.jogging = savedJogging;

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Failed to save the jogging info' });
  }
};

export const getJoggingsMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== 'regular' && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized access' });
    }
    let query = {};

    if (req.user.role === 'regular') {
      query = { createdBy: req.user.id };
    }

    const joggings = await Jogging.find(query).sort({ date: -1 });

    if (req.user.role === 'admin') {
      res.locals.joggings = joggings;
    } else if (req.user.role === 'regular') {
      res.locals.joggings = joggings.filter((jogging) => jogging.createdBy.toString() === req.user.id);
    }

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Error while retrieving joggings' });
  }
};

export const updateJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== 'regular' && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized access' });
    }
    const { id } = req.params;

    const jogging = await Jogging.findById(id);

    if (!jogging) {
      return res.status(404).send({ message: `Cannot update jogging with id ${id}. Jogging not found!` });
    }

    if (req.user.role === 'admin' || jogging.createdBy.toString() === req.user.id) {
      const updatedJogging = await Jogging.findByIdAndUpdate(id, req.body, {
        new: true,
        useFindAndModify: false,
      });

      res.locals.jogging = updatedJogging;

      return next();
    }
    return res.status(403).send({ message: 'Unauthorized access' });
  } catch (err) {
    return res.status(500).send({ message: 'Error updating jogging information' });
  }
};

export const deleteJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== 'regular' && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized access' });
    }
    const { id } = req.params;

    const jogging = await Jogging.findById(id);

    if (!jogging) {
      return res.status(404).send({ message: `Cannot delete jogging with id ${id}. Jogging not found!` });
    }

    if (req.user.role === 'admin' || jogging.createdBy.toString() === req.user.id) {
      const deletedJogging = await Jogging.findByIdAndRemove(id);

      if (!deletedJogging) {
        return res.status(404).send({ message: `Cannot delete jogging with id ${id}. Jogging not found!` });
      }

      res.locals.deletedJogging = deletedJogging;

      return next();
    }

    return res.status(403).send({ message: 'Unauthorized access' });
  } catch (err) {
    return res.status(500).send({ message: 'Error during the deleting operation' });
  }
};

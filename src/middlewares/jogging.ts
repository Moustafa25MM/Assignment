/* eslint-disable max-len */
import { NextFunction } from 'express';
import Jogging from '../models/jogging';

export const createJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
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
    const { id } = req.query;

    if (id) {
      const jogging = await Jogging.findById(id);

      if (!jogging) {
        return res.status(404).send({ message: 'Jogging info not found!' });
      }

      if (req.user.role === 'regular' && jogging.createdBy.toString() !== req.user.id) {
        return res.status(403).send({ message: 'Unauthorized access' });
      }

      res.locals.jogging = jogging;
    } else {
      let query = {};

      if (req.user.role === 'regular') {
        query = { createdBy: req.user.id };
      }

      const joggings = await Jogging.find(query).sort({ date: -1 });

      res.locals.joggings = joggings;
    }

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Error while viewing jogging info' });
  }
};

export const updateJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const jogging = await Jogging.findById(id);

    if (!jogging) {
      return res.status(404).send({ message: `Cannot update jogging with id ${id}. Jogging not found!` });
    }

    if (req.user.role === 'regular' && jogging.createdBy.toString() !== req.user.id) {
      return res.status(403).send({ message: 'Unauthorized access' });
    }

    const updatedJogging = await Jogging.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });

    res.locals.jogging = updatedJogging;

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Error updating jogging information' });
  }
};

export const deleteJoggingMiddleware = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const jogging = await Jogging.findById(id);

    if (!jogging) {
      return res.status(404).send({ message: `Cannot delete jogging with id ${id}. Jogging not found!` });
    }

    if (req.user.role === 'regular' && jogging.createdBy.toString() !== req.user.id) {
      return res.status(403).send({ message: 'Unauthorized access' });
    }

    const deletedJogging = await Jogging.findByIdAndRemove(id);

    res.locals.deletedJoggingId = id;

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Error during the deleting operation' });
  }
};

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import Jogging from '../models/jogging';

export const createJogging = async (req: any, res: any): Promise<Response> => {
  try {
    if (res.locals.jogging) {
      return res.status(201).json(res.locals.jogging); // return the saved jogging from the middleware if it already exists
    }

    const { date, distance, time } = req.body;
    const userId = req.user.id;

    if (!date || !distance || !time) {
      return res.status(400).send({ message: 'The jogging data is missing fields' });
    }

    const jogging = new Jogging({
      date,
      distance,
      time,
      createdBy: userId,
    });

    const savedJogging = await jogging.save();

    return res.status(201).json(savedJogging);
  } catch (err) {
    return res.status(500).send({ message: 'Failed to save the jogging info' });
  }
};

export const getJoggings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.query;

    if (id) {
      const jogging = await Jogging.findById(id);

      if (!jogging) {
        return res.status(404).send({ message: 'Jogging info not found!' });
      }

      return res.json(jogging);
    }

    return res.json(res.locals.joggings);
  } catch (err) {
    return res.status(500).send({ message: 'Error while viewing jogging info' });
  }
};

export const updateJogging = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const updatedJogging = res.locals.jogging || await Jogging.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });

    if (!updatedJogging) {
      return res.status(404).send({ message: `Cannot update jogging with id ${id}. Jogging not found!` });
    }

    return res.json(updatedJogging);
  } catch (err) {
    return res.status(500).send({ message: 'Error updating jogging information' });
  }
};

export const deleteJogging = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { deletedJogging } = res.locals;

    if (!deletedJogging) {
      return res.status(404).send({ message: 'Cannot delete jogging. Jogging not found!' });
    }

    return res.json({ message: `Successfully deleted jogging of id ${deletedJogging._id}` });
  } catch (err) {
    return res.status(500).send({ message: 'Error during the deleting operation' });
  }
};

export const getJoggingById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const jogging = await Jogging.findById(id).populate({ path: 'createdBy', model: 'user' });

    if (!jogging) {
      return res.status(404).send({ message: 'Jogging info not found!' });
    }

    return res.json(jogging);
  } catch (err) {
    return res.status(500).send({ message: 'Error while retrieving jogging info' });
  }
};

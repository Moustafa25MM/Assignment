import { Request, Response } from 'express';
import Jogging from '../models/jogging';

export const createJogging = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { date, distance, time } = req.body;

    if (!date || !distance || !time) {
      return res.status(400).send({ message: 'The jogging data is missing fields' });
    }

    const jogging = new Jogging({
      date,
      distance,
      time,
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
    const joggings = await Jogging.find().sort({ date: -1 });

    return res.json(joggings);
  } catch (err) {
    return res.status(500).send({ message: 'Error while viewing jogging info' });
  }
};

export const updateJogging = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const updatedJogging = await Jogging.findByIdAndUpdate(id, req.body, {
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
    const { id } = req.params;

    const deletedJogging = await Jogging.findByIdAndRemove(id);

    if (!deletedJogging) {
      return res.status(404).send({ message: `Cannot delete jogging with id ${id}. Jogging not found!` });
    }

    return res.json({ message: `Successfully deleted jogging of id ${id}` });
  } catch (err) {
    return res.status(500).send({ message: 'Error during the deleting operation' });
  }
};

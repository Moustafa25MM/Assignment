/* eslint-disable radix */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Jogging from '../models/jogging';
import { paginationOption } from '../libs/paginations';

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

    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
    const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string) : 1;

    const totaldocs = await Jogging.countDocuments();

    const joggings = await Jogging.find({})
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const pagination = paginationOption(pageSize, pageNumber, totaldocs);

    return res.json({
      data: {
        pagination,
        joggings,
      },
    });
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

export const getJoggingById = async (req: any, res: Response): Promise<Response> => {
  try {
    if (req.user.role !== 'regular' && req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Unauthorized access' });
    }
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
export const filterJoggingsByDate = async (req: Request, res: Response) : Promise<Response> => {
  const { from } = req.query;
  const { to } = req.query;

  if (!from || !to) {
    return res.status(400).send({ message: 'Please provide both "from" and "to" dates.' });
  }

  const fromDate = typeof from === 'string' ? from : (from as ParsedQs).toString();
  const toDate = typeof to === 'string' ? to : (to as ParsedQs).toString();

  const dateFormat = /[^-\d]/;
  if (dateFormat.test(fromDate) || dateFormat.test(toDate)) {
    return res.status(400).send({ message: 'Invalid date format. Please use ISO 8601 format (e.g. YYYY-MM-DD).' });
  }

  const filteredJoggings = res.locals.joggings.filter((jogging: { date: string | number | Date; }) => {
    const joggingDate = new Date(jogging.date);
    return joggingDate >= new Date(fromDate) && joggingDate <= new Date(toDate);
  });

  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
  const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string) : 1;
  const totaldocs = filteredJoggings.length;

  const paginatedJoggings = filteredJoggings.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const pagination = paginationOption(pageSize, pageNumber, totaldocs);

  return res.json({
    data: {
      pagination,
      joggings: paginatedJoggings,
    },
  });
};

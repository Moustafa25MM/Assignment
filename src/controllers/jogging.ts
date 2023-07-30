/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable radix */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import Jogging from '../models/jogging';
import { paginationOption } from '../libs/paginations';

export const createJogging = async (req: any, res: any): Promise<Response> => {
  try {
    if (res.locals.jogging) {
      return res.status(201).json(res.locals.jogging);
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
    const filteredJoggings = res.locals.joggings;

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
    // return res.json(res.locals.joggings);
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

function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getStartOfWeek(year: number, week: number): Date {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToFirstWeek = (8 - firstDayOfYear.getDay()) % 7 || 7;
  const startDate = new Date(year, 0, daysToFirstWeek + (7 * (week - 1)));
  return startDate;
}

function getEndOfWeek(year: number, week: number): Date {
  const startDate = getStartOfWeek(year, week);
  const endDate = new Date(startDate.getTime() + (6 * 86400000));
  return endDate;
}

export const getWeeklyReport = async (req: any, res: Response) => {
  try {
    /*
    The logic for generating the weekly report is as follows:
        1-Query the Jogging collection for all joggings.
        2-Loop through each jogging and extract the year, week, distance, and time.
        4-Calculate the start and end dates of the week from the year and week.
        5-Group the joggings by year and week and calculate the total distance, time, and count of joggings for each week.
        6-Calculate the average speed for each week by dividing the total distance by the total time.
        7-Create an object for each week containing the year, week, start date, end date, distance, time, count, and average speed.
        8-Add each week's object to an array and return the array as the weekly report.
    */
    const createdBy = req.user.id;
    const joggings = await Jogging.find({ createdBy });
    const weeklyData: Record<string, { distance: number, time: number, count: number }> = {};
    for (const jogging of joggings) {
      const joggingDate = new Date(jogging.date);
      const year = joggingDate.getFullYear();
      const week = getWeekOfYear(joggingDate);

      const key = `${year}-${week}`;

      if (!weeklyData.hasOwnProperty(key)) {
        weeklyData[key] = { distance: 0, time: 0, count: 0 };
      }

      weeklyData[key].distance += Number(jogging.distance);
      weeklyData[key].time += Number(jogging.time);
      weeklyData[key].count += 1;
    }

    const weeklyReport = [];

    for (const [key, value] of Object.entries(weeklyData)) {
      const [year, week] = key.split('-').map(Number);

      const startDate = getStartOfWeek(year, week);
      const endDate = getEndOfWeek(year, week);

      const { distance } = value;
      const { time } = value;
      const { count } = value;
      const averageSpeed = count > 0 ? distance / time : 0;

      weeklyReport.push({
        week,
        year,
        startDate,
        endDate,
        distance,
        time,
        count,
        averageSpeed,
      });
    }

    res.json(weeklyReport);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

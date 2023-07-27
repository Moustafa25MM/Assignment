import mongoose from 'mongoose';

const { Schema } = mongoose;

interface JoggingType {
  date: string;
  distance: Number;
  time: string;
}

const joggingSchema = new Schema<JoggingType>(
  {
    date: {
      type: String,
      required: true,
      maxLength: 100,
    },
    distance: {
      type: Number,
      required: true,
      maxLength: 70,
    },
    time: {
      type: String,
      required: true,
      maxLength: 100,
    },
  },
);

const Jogging = mongoose.model('jogging', joggingSchema);
export default Jogging;

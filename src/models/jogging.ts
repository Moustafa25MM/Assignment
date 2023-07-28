import mongoose from 'mongoose';

const { Schema } = mongoose;

interface JoggingType {
  date: Date;
  distance: Number;
  time: Number;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const joggingSchema = new Schema<JoggingType>(
  {
    date: {
      type: Date,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      maxLength: 70,
    },
    time: {
      type: Number,
      required: true,
    },
  },
);

const Jogging = mongoose.model('jogging', joggingSchema);
export default Jogging;

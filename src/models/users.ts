import mongoose from 'mongoose';

const { Schema } = mongoose;

interface UserType {
  name: string;
  password: string;
  email: string;
  role: string;
}

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // eslint-disable-next-line no-param-reassign
        delete ret.password;
      },
    },
  },
);

const User = mongoose.model('user', userSchema);
export default User;

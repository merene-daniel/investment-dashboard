import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  username: string
  passwordHash: string
  salt: string
  country: string
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    username:     { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    salt:         { type: String, required: true },
    country:      { type: String, required: true },
    phone:        { type: String, default: null },
  },
  { timestamps: true }
)

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema)

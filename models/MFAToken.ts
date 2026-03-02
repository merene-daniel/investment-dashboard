import mongoose, { Schema, Document } from 'mongoose'

export interface IMFAToken extends Document {
  userId: mongoose.Types.ObjectId | null
  type: 'email' | 'phone'
  target: string
  codeHash: string
  salt: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}

const MFATokenSchema = new Schema<IMFAToken>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', default: null },
    type:     { type: String, enum: ['email', 'phone'], required: true },
    target:   { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    salt:     { type: String, required: true },
    expiresAt:{ type: Date, required: true },
    used:     { type: Boolean, default: false },
  },
  { timestamps: true }
)

// MongoDB TTL index — documents are automatically removed after expiresAt
MFATokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
MFATokenSchema.index({ target: 1, used: 1 })

export default mongoose.models.MFAToken ||
  mongoose.model<IMFAToken>('MFAToken', MFATokenSchema)

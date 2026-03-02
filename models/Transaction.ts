import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  portfolioId: mongoose.Types.ObjectId
  symbol: string
  name: string
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL'
  shares: number | null
  price: number
  totalAmount: number
  fees: number
  date: Date
  notes: string
  status: 'Completed' | 'Pending' | 'Cancelled'
}

const TransactionSchema = new Schema<ITransaction>(
  {
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    symbol: { type: String, uppercase: true, default: '' },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL'],
      required: true,
    },
    shares: { type: Number, default: null },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Completed',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)

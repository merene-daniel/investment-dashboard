import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolio extends Document {
  name: string
  description: string
  totalValue: number
  cashBalance: number
  totalInvested: number
  totalPnL: number
  totalPnLPercent: number
  dayPnL: number
  dayPnLPercent: number
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive'
  currency: string
  createdAt: Date
  updatedAt: Date
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    totalValue: { type: Number, default: 0 },
    cashBalance: { type: Number, default: 0 },
    totalInvested: { type: Number, default: 0 },
    totalPnL: { type: Number, default: 0 },
    totalPnLPercent: { type: Number, default: 0 },
    dayPnL: { type: Number, default: 0 },
    dayPnLPercent: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
      default: 'Moderate',
    },
    currency: { type: String, default: 'USD' },
  },
  { timestamps: true }
)

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)

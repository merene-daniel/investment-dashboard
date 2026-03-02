import mongoose, { Schema, Document } from 'mongoose'

export interface IHolding extends Document {
  portfolioId: mongoose.Types.ObjectId
  symbol: string
  name: string
  sector: string
  assetType: 'Stock' | 'ETF' | 'Bond' | 'Crypto' | 'Commodity'
  shares: number
  avgCostBasis: number
  currentPrice: number
  marketValue: number
  totalCost: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  dayChange: number
  dayChangePercent: number
  weight: number
  beta: number
  dividendYield: number
  peRatio: number | null
  marketCap: number | null
  color: string
  createdAt: Date
  updatedAt: Date
}

const HoldingSchema = new Schema<IHolding>(
  {
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    symbol: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    sector: { type: String, default: 'Other' },
    assetType: {
      type: String,
      enum: ['Stock', 'ETF', 'Bond', 'Crypto', 'Commodity'],
      default: 'Stock',
    },
    shares: { type: Number, required: true },
    avgCostBasis: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    marketValue: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    unrealizedPnL: { type: Number, default: 0 },
    unrealizedPnLPercent: { type: Number, default: 0 },
    dayChange: { type: Number, default: 0 },
    dayChangePercent: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    beta: { type: Number, default: 1 },
    dividendYield: { type: Number, default: 0 },
    peRatio: { type: Number, default: null },
    marketCap: { type: Number, default: null },
    color: { type: String, default: '#eab308' },
  },
  { timestamps: true }
)

export default mongoose.models.Holding ||
  mongoose.model<IHolding>('Holding', HoldingSchema)

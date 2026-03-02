import mongoose, { Schema, Document } from 'mongoose'

export interface IPerformanceSnapshot extends Document {
  portfolioId: mongoose.Types.ObjectId
  date: Date
  totalValue: number
  dayReturn: number
  totalReturn: number
  totalReturnPercent: number
  benchmark: number
}

const PerformanceSnapshotSchema = new Schema<IPerformanceSnapshot>(
  {
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    date: { type: Date, required: true },
    totalValue: { type: Number, required: true },
    dayReturn: { type: Number, default: 0 },
    totalReturn: { type: Number, default: 0 },
    totalReturnPercent: { type: Number, default: 0 },
    benchmark: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.PerformanceSnapshot ||
  mongoose.model<IPerformanceSnapshot>('PerformanceSnapshot', PerformanceSnapshotSchema)

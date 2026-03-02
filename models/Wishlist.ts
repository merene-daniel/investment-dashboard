import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlist extends Document {
  portfolioId:  mongoose.Types.ObjectId
  symbol:       string
  name:         string
  targetPrice:  number
  currentPrice: number | null
  sector:       string
  priority:     'High' | 'Medium' | 'Low'
  notes:        string
}

const WishlistSchema = new Schema<IWishlist>(
  {
    portfolioId:  { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    symbol:       { type: String, uppercase: true, required: true },
    name:         { type: String, required: true },
    targetPrice:  { type: Number, required: true },
    currentPrice: { type: Number, default: null },
    sector:       { type: String, default: '' },
    priority:     { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    notes:        { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.Wishlist ||
  mongoose.model<IWishlist>('Wishlist', WishlistSchema)

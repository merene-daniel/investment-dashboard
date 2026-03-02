const mongoose = require('mongoose')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

function resolveMongoUri() {
  const rawUri = process.env.MONGODB_URI?.trim()
  if (rawUri) return rawUri

  const user = process.env.MONGODB_USER?.trim()
  const password = process.env.MONGODB_PASSWORD?.trim()
  const cluster = process.env.MONGODB_CLUSTER?.trim()
  const db = process.env.MONGODB_DB?.trim() || 'investment_dashboard'

  if (!user || !password || !cluster) {
    throw new Error(
      'Missing MongoDB config. Set MONGODB_URI or MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER.'
    )
  }

  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${cluster}/${db}`
}

const MONGODB_URI = resolveMongoUri()

if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
  throw new Error('Resolved MongoDB URI points to localhost. Use a MongoDB Atlas connection.')
}

// Schemas
const PortfolioSchema = new mongoose.Schema({
  name: String, description: String, totalValue: Number, cashBalance: Number,
  totalInvested: Number, totalPnL: Number, totalPnLPercent: Number,
  dayPnL: Number, dayPnLPercent: Number, riskLevel: String, currency: String,
}, { timestamps: true })

const HoldingSchema = new mongoose.Schema({
  portfolioId: mongoose.Schema.Types.ObjectId,
  symbol: String, name: String, sector: String, assetType: String,
  shares: Number, avgCostBasis: Number, currentPrice: Number,
  marketValue: Number, totalCost: Number, unrealizedPnL: Number,
  unrealizedPnLPercent: Number, dayChange: Number, dayChangePercent: Number,
  weight: Number, beta: Number, dividendYield: Number,
  peRatio: Number, marketCap: Number, color: String,
}, { timestamps: true })

const TransactionSchema = new mongoose.Schema({
  portfolioId: mongoose.Schema.Types.ObjectId,
  symbol: String, name: String, type: String, shares: Number,
  price: Number, totalAmount: Number, fees: Number, date: Date, notes: String, status: String,
}, { timestamps: true })

const PerformanceSchema = new mongoose.Schema({
  portfolioId: mongoose.Schema.Types.ObjectId,
  date: Date, totalValue: Number, dayReturn: Number,
  totalReturn: Number, totalReturnPercent: Number, benchmark: Number,
}, { timestamps: true })

const Portfolio = mongoose.model('Portfolio', PortfolioSchema)
const Holding = mongoose.model('Holding', HoldingSchema)
const Transaction = mongoose.model('Transaction', TransactionSchema)
const PerformanceSnapshot = mongoose.model('PerformanceSnapshot', PerformanceSchema)

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', assetType: 'Stock', shares: 150, avgCostBasis: 145.50, currentPrice: 189.84, beta: 1.2, dividendYield: 0.52, peRatio: 29.4, marketCap: 2940000000000, color: '#eab308' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', assetType: 'Stock', shares: 85, avgCostBasis: 280.20, currentPrice: 415.26, beta: 0.9, dividendYield: 0.72, peRatio: 35.1, marketCap: 3090000000000, color: '#3b82f6' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', assetType: 'Stock', shares: 45, avgCostBasis: 420.00, currentPrice: 875.35, beta: 1.8, dividendYield: 0.03, peRatio: 65.2, marketCap: 2160000000000, color: '#10b981' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', assetType: 'Stock', shares: 60, avgCostBasis: 135.00, currentPrice: 186.52, beta: 1.3, dividendYield: 0, peRatio: 42.8, marketCap: 1950000000000, color: '#f97316' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', assetType: 'Stock', shares: 75, avgCostBasis: 125.00, currentPrice: 172.63, beta: 1.1, dividendYield: 0, peRatio: 22.5, marketCap: 2170000000000, color: '#8b5cf6' },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', assetType: 'Stock', shares: 120, avgCostBasis: 158.00, currentPrice: 212.45, beta: 1.1, dividendYield: 2.3, peRatio: 12.4, marketCap: 615000000000, color: '#06b6d4' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', assetType: 'Stock', shares: 200, avgCostBasis: 320.00, currentPrice: 378.90, beta: 0.7, dividendYield: 0, peRatio: 18.2, marketCap: 832000000000, color: '#ec4899' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', sector: 'Diversified', assetType: 'ETF', shares: 100, avgCostBasis: 380.00, currentPrice: 485.62, beta: 1.0, dividendYield: 1.38, peRatio: null, marketCap: null, color: '#a78bfa' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'Technology', assetType: 'ETF', shares: 50, avgCostBasis: 350.00, currentPrice: 470.08, beta: 1.2, dividendYield: 0.52, peRatio: null, marketCap: null, color: '#34d399' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', sector: 'Fixed Income', assetType: 'Bond', shares: 150, avgCostBasis: 98.00, currentPrice: 93.45, beta: -0.2, dividendYield: 4.1, peRatio: null, marketCap: null, color: '#fbbf24' },
]

function generatePerformanceData(portfolioId, startValue) {
  const data = []
  let value = startValue * 0.75
  const now = new Date()
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.45) * 0.015
    value = value * (1 + change)
    const benchmarkChange = (Math.random() - 0.45) * 0.012
    const benchmark = i === 365 ? 100 : data[data.length - 1].benchmark * (1 + benchmarkChange)
    data.push({
      portfolioId,
      date,
      totalValue: Math.round(value * 100) / 100,
      dayReturn: Math.round(value * change * 100) / 100,
      totalReturn: Math.round((value - startValue * 0.75) * 100) / 100,
      totalReturnPercent: Math.round(((value - startValue * 0.75) / (startValue * 0.75)) * 10000) / 100,
      benchmark: Math.round(benchmark * 100) / 100,
    })
  }
  return data
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('Connected. Clearing existing data...')

  await Portfolio.deleteMany({})
  await Holding.deleteMany({})
  await Transaction.deleteMany({})
  await PerformanceSnapshot.deleteMany({})

  console.log('Creating portfolio...')

  const holdingData = holdings.map(h => {
    const marketValue = h.shares * h.currentPrice
    const totalCost = h.shares * h.avgCostBasis
    const unrealizedPnL = marketValue - totalCost
    const unrealizedPnLPercent = (unrealizedPnL / totalCost) * 100
    const dayChange = (Math.random() - 0.4) * h.currentPrice * 0.03
    return { ...h, marketValue, totalCost, unrealizedPnL, unrealizedPnLPercent,
      dayChange: Math.round(dayChange * 100) / 100,
      dayChangePercent: Math.round((dayChange / h.currentPrice) * 10000) / 100 }
  })

  const totalMarketValue = holdingData.reduce((s, h) => s + h.marketValue, 0)
  const totalCost = holdingData.reduce((s, h) => s + h.totalCost, 0)
  const totalPnL = totalMarketValue - totalCost
  const dayPnL = holdingData.reduce((s, h) => s + h.dayChange * h.shares, 0)
  const cashBalance = 24350.00
  const totalValue = totalMarketValue + cashBalance

  const portfolio = await Portfolio.create({
    name: 'Growth Portfolio Alpha',
    description: 'Diversified growth portfolio focused on technology and blue-chip equities',
    totalValue: Math.round(totalValue * 100) / 100,
    cashBalance,
    totalInvested: totalCost,
    totalPnL: Math.round(totalPnL * 100) / 100,
    totalPnLPercent: Math.round((totalPnL / totalCost) * 10000) / 100,
    dayPnL: Math.round(dayPnL * 100) / 100,
    dayPnLPercent: Math.round((dayPnL / totalValue) * 10000) / 100,
    riskLevel: 'Moderate',
    currency: 'USD',
  })

  const holdingsWithWeight = holdingData.map(h => ({
    ...h,
    portfolioId: portfolio._id,
    weight: Math.round((h.marketValue / totalMarketValue) * 10000) / 100,
  }))

  await Holding.insertMany(holdingsWithWeight)
  console.log(`Created ${holdingsWithWeight.length} holdings`)

  // Transactions
  const transactions = []
  const types = ['BUY', 'SELL', 'DIVIDEND']
  for (let i = 0; i < 50; i++) {
    const holding = holdingData[Math.floor(Math.random() * holdingData.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const shares = type === 'DIVIDEND' ? null : Math.floor(Math.random() * 20) + 1
    const price = holding.currentPrice * (0.9 + Math.random() * 0.2)
    const totalAmount = type === 'DIVIDEND' 
      ? holding.shares * price * holding.dividendYield / 400
      : (shares || 0) * price
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))
    transactions.push({
      portfolioId: portfolio._id,
      symbol: holding.symbol, name: holding.name, type,
      shares, price: Math.round(price * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      fees: type === 'DIVIDEND' ? 0 : Math.round(Math.random() * 500) / 100,
      date, status: 'Completed', notes: '',
    })
  }
  transactions.push({
    portfolioId: portfolio._id, symbol: '', name: 'Initial Deposit',
    type: 'DEPOSIT', shares: null, price: 1, totalAmount: 500000,
    fees: 0, date: new Date(Date.now() - 366 * 86400000), status: 'Completed', notes: 'Initial portfolio funding',
  })

  await Transaction.insertMany(transactions)
  console.log(`Created ${transactions.length} transactions`)

  const perfData = generatePerformanceData(portfolio._id, totalValue)
  await PerformanceSnapshot.insertMany(perfData)
  console.log(`Created ${perfData.length} performance snapshots`)

  console.log('\n✅ Database seeded successfully!')
  console.log(`Portfolio ID: ${portfolio._id}`)
  await mongoose.disconnect()
}

seed().catch(console.error)

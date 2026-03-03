'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Download, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface TransactionsTabProps {
  transactions: any[]
  portfolio: any
}

const TYPE_COLORS: Record<string, string> = {
  BUY:        '#10b981',
  SELL:       '#ef4444',
  DIVIDEND:   '#eab308',
  DEPOSIT:    '#8b5cf6',
  WITHDRAWAL: '#f97316',
}

const TX_TYPES  = ['BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL']
const STATUSES  = ['Completed', 'Pending', 'Cancelled']
const FILTER_TYPES = ['All', ...TX_TYPES]

const EMPTY_FORM = {
  type:        'BUY',
  symbol:      '',
  name:        '',
  date:        new Date().toISOString().split('T')[0],
  shares:      '',
  price:       '',
  totalAmount: '',
  fees:        '0',
  status:      'Completed',
  notes:       '',
}

export default function TransactionsTab({ transactions: initialTxs, portfolio }: TransactionsTabProps) {
  const [txList,      setTxList]      = useState(initialTxs)
  const [filterType,  setFilterType]  = useState('All')
  const [searchSymbol,setSearchSymbol]= useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [submitting,  setSubmitting]  = useState(false)
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [formError,   setFormError]   = useState('')

  // BUY / SELL: auto-calculate totalAmount from shares × price + fees
  const hasSharesPrice = ['BUY', 'SELL'].includes(form.type)
  const hasSymbol      = ['BUY', 'SELL', 'DIVIDEND'].includes(form.type)

  useEffect(() => {
    if (!hasSharesPrice) return
    const s = parseFloat(form.shares)
    const p = parseFloat(form.price)
    const f = parseFloat(form.fees) || 0
    if (!isNaN(s) && !isNaN(p)) {
      setForm(prev => ({ ...prev, totalAmount: (s * p + f).toFixed(2) }))
    }
  }, [form.shares, form.price, form.fees, hasSharesPrice])

  function openModal() {
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function setField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const totalAmount = parseFloat(form.totalAmount)
    const price       = hasSharesPrice ? parseFloat(form.price) : totalAmount
    const shares      = hasSharesPrice ? (parseFloat(form.shares) || null) : null
    const fees        = parseFloat(form.fees) || 0

    if (!form.name.trim())              { setFormError('Name is required'); return }
    if (!form.date)                      { setFormError('Date is required'); return }
    if (isNaN(totalAmount) || totalAmount < 0) { setFormError('Valid total amount is required'); return }
    if (hasSharesPrice && (isNaN(price) || price < 0)) { setFormError('Valid price is required'); return }

    setSubmitting(true)
    try {
      const payload = {
        portfolioId: portfolio._id,
        type:        form.type,
        symbol:      form.symbol.trim().toUpperCase(),
        name:        form.name.trim(),
        date:        new Date(form.date).toISOString(),
        shares,
        price,
        totalAmount,
        fees,
        status:      form.status,
        notes:       form.notes.trim(),
      }

      const res  = await fetch('/api/transactions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add transaction')

      setTxList(prev => [json.data, ...prev])
      closeModal()
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res  = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete')
      setTxList(prev => prev.filter(t => t._id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete transaction')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = txList.filter(tx => {
    if (filterType !== 'All' && tx.type !== filterType) return false
    if (searchSymbol) {
      const q = searchSymbol.toLowerCase()
      if (!tx.symbol?.toLowerCase().includes(q) && !tx.name?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const buyTotal      = txList.filter(t => t.type === 'BUY').reduce((s, t) => s + t.totalAmount, 0)
  const sellTotal     = txList.filter(t => t.type === 'SELL').reduce((s, t) => s + t.totalAmount, 0)
  const dividendTotal = txList.filter(t => t.type === 'DIVIDEND').reduce((s, t) => s + t.totalAmount, 0)

  return (
    <div className="space-y-5">

      {/* ── Summary cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TOTAL BOUGHT', value: formatCurrency(buyTotal, true),      color: '#10b981' },
          { label: 'TOTAL SOLD',   value: formatCurrency(sellTotal, true),     color: '#ef4444' },
          { label: 'DIVIDENDS',    value: formatCurrency(dividendTotal, true), color: '#eab308' },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {item.label}
              </div>
              <div className="font-mono text-xl font-medium" style={{ color: item.color }}>
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {FILTER_TYPES.map(type => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => setFilterType(type)}
              className="px-3 py-1.5 h-auto text-xs font-medium transition-all"
              style={
                filterType === type
                  ? { background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }
                  : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' }
              }
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Input
            placeholder="Search symbol or name..."
            value={searchSymbol}
            onChange={e => setSearchSymbol(e.target.value)}
            className="bg-transparent text-sm border-none outline-none shadow-none h-auto p-0 focus-visible:ring-0"
            style={{ color: 'var(--text-primary)', width: '160px' }}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download size={14} />
            Export
          </Button>
          <Button size="sm" onClick={openModal} className="flex items-center gap-2">
            <Plus size={14} />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* ── Transactions table ─────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Type</TableHead>
                <TableHead className="text-left">Asset</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Fees</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-right" style={{ width: '120px' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tx => {
                const color      = TYPE_COLORS[tx.type] || '#6b7280'
                const confirming = deletingId === tx._id
                return (
                  <TableRow key={tx._id}>
                    <TableCell className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="font-mono text-xs rounded"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {tx.symbol || '—'}
                      </div>
                      <div className="text-xs truncate max-w-36" style={{ color: 'var(--text-muted)' }}>
                        {tx.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {tx.shares ? tx.shares.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {tx.shares ? formatCurrency(tx.price) : '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(tx.totalAmount, true)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs" style={{ color: tx.fees > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                      {tx.fees > 0 ? `−${formatCurrency(tx.fees)}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs rounded"
                        style={{
                          background: tx.status === 'Completed' ? 'rgba(16,185,129,0.1)' : 'rgba(234,179,8,0.1)',
                          color:      tx.status === 'Completed' ? '#10b981' : '#eab308',
                          border:     'none',
                        }}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>

                    {/* Delete cell */}
                    <TableCell className="text-right">
                      {confirming ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Delete?</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(null)}
                            className="text-xs px-2 py-0.5 h-auto"
                          >
                            No
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(tx._id)}
                            className="text-xs px-2 py-0.5 h-auto"
                          >
                            Yes
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(tx._id)}
                          aria-label="Delete transaction"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add Transaction Modal ──────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={open => { if (!open) closeModal() }}>
        <DialogContent
          className="w-full max-w-lg rounded-2xl"
          style={{
            background: 'var(--bg-secondary)',
            border:     '1px solid var(--border)',
            maxHeight:  '92vh',
            overflowY:  'auto',
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-display font-semibold text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              New Transaction
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleAdd} className="space-y-4">

            {/* Type + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  TYPE *
                </label>
                <select value={form.type} onChange={e => setField('type', e.target.value)}>
                  {TX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  STATUS
                </label>
                <select value={form.status} onChange={e => setField('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Symbol + Name */}
            <div className="grid grid-cols-2 gap-4">
              {hasSymbol && (
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    SYMBOL
                  </label>
                  <Input
                    placeholder="AAPL"
                    value={form.symbol}
                    onChange={e => setField('symbol', e.target.value.toUpperCase())}
                  />
                </div>
              )}
              <div className={hasSymbol ? '' : 'col-span-2'}>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  NAME *
                </label>
                <Input
                  placeholder={hasSymbol ? 'Apple Inc.' : 'Bank transfer'}
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                DATE *
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setField('date', e.target.value)}
                required
              />
            </div>

            {/* Shares + Price — BUY / SELL only */}
            {hasSharesPrice && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    SHARES
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="10"
                    value={form.shares}
                    onChange={e => setField('shares', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    {form.type === 'BUY' ? 'PRICE / SHARE' : 'SALE PRICE / SHARE'}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="150.00"
                    value={form.price}
                    onChange={e => setField('price', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Total Amount + Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  TOTAL AMOUNT *
                  {hasSharesPrice && (
                    <span className="ml-1 normal-case italic" style={{ color: 'var(--gold)', fontFamily: 'inherit', letterSpacing: 0 }}>
                      (auto-calculated)
                    </span>
                  )}
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="1500.00"
                  value={form.totalAmount}
                  onChange={e => setField('totalAmount', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  FEES
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={form.fees}
                  onChange={e => setField('fees', e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                NOTES
              </label>
              <textarea
                rows={2}
                placeholder="Optional notes..."
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Error banner */}
            {formError && (
              <div
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color:      '#ef4444',
                  border:     '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {formError}
              </div>
            )}

            {/* Action buttons */}
            <DialogFooter className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Adding…' : 'Add Transaction'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

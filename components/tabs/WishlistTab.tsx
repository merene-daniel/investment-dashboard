'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, X, Heart, TrendingUp, TrendingDown } from 'lucide-react'

interface WishlistTabProps {
  wishlist:  any[]
  portfolio: any
}

const PRIORITIES  = ['High', 'Medium', 'Low'] as const
const SECTORS     = ['Technology', 'Financials', 'Healthcare', 'Consumer', 'Energy', 'Industrials', 'Materials', 'Utilities', 'Real Estate', 'Communication', 'Other']

const PRIORITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  High:   { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.25)'   },
  Medium: { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', border: 'rgba(234,179,8,0.25)'   },
  Low:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.25)'  },
}

const EMPTY_FORM = {
  symbol:       '',
  name:         '',
  targetPrice:  '',
  currentPrice: '',
  sector:       '',
  priority:     'Medium' as const,
  notes:        '',
}

export default function WishlistTab({ wishlist: initialList, portfolio }: WishlistTabProps) {
  const [list,        setList]        = useState(initialList)
  const [filterPri,   setFilterPri]   = useState('All')
  const [search,      setSearch]      = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [submitting,  setSubmitting]  = useState(false)
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [formError,   setFormError]   = useState('')

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])

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

    const targetPrice  = parseFloat(form.targetPrice)
    const currentPrice = form.currentPrice ? parseFloat(form.currentPrice) : null

    if (!form.symbol.trim())                           { setFormError('Symbol is required'); return }
    if (!form.name.trim())                             { setFormError('Name is required'); return }
    if (isNaN(targetPrice) || targetPrice <= 0)        { setFormError('Valid target price is required'); return }
    if (currentPrice !== null && isNaN(currentPrice))  { setFormError('Invalid current price'); return }

    setSubmitting(true)
    try {
      const payload = {
        portfolioId:  portfolio._id,
        symbol:       form.symbol.trim().toUpperCase(),
        name:         form.name.trim(),
        targetPrice,
        currentPrice,
        sector:       form.sector,
        priority:     form.priority,
        notes:        form.notes.trim(),
      }

      const res  = await fetch('/api/wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add item')

      setList(prev => [json.data, ...prev])
      closeModal()
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res  = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete')
      setList(prev => prev.filter(item => item._id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete wishlist item')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = list.filter(item => {
    if (filterPri !== 'All' && item.priority !== filterPri) return false
    if (search) {
      const q = search.toLowerCase()
      if (!item.symbol?.toLowerCase().includes(q) && !item.name?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const highCount = list.filter(i => i.priority === 'High').length
  const avgTarget = list.length ? list.reduce((s, i) => s + i.targetPrice, 0) / list.length : 0

  return (
    <div className="space-y-5">

      {/* ── Summary cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'TOTAL WATCHLIST', value: `${list.length} stocks`,              color: '#eab308'  },
          { label: 'HIGH PRIORITY',   value: `${highCount} stocks`,                color: '#ef4444'  },
          { label: 'AVG TARGET PRICE',value: avgTarget ? formatCurrency(avgTarget) : '—', color: '#10b981' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {item.label}
            </div>
            <div className="font-mono text-xl font-medium" style={{ color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Priority filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {['All', ...PRIORITIES].map(p => (
            <button
              key={p}
              onClick={() => setFilterPri(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterPri === p ? 'rgba(234,179,8,0.15)' : 'transparent',
                color:      filterPri === p ? '#eab308' : 'var(--text-muted)',
                border:     filterPri === p ? '1px solid rgba(234,179,8,0.25)' : '1px solid transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <input
            placeholder="Search symbol or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)', border: 'none', padding: 0, width: '160px' }}
          />
        </div>

        <button
          onClick={openModal}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)', color: '#0d0d0a' }}
        >
          <Plus size={14} />
          Add to Wishlist
        </button>
      </div>

      {/* ── Cards grid ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card">
          <Heart size={40} style={{ color: 'var(--text-muted)' }} className="mb-4" />
          <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {list.length === 0 ? 'Your wishlist is empty' : 'No stocks match your filter'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {list.length === 0 ? 'Add stocks you want to watch or buy' : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const pStyle      = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.Medium
            const confirming  = deletingId === item._id
            const hasCurrent  = item.currentPrice != null && item.currentPrice > 0
            const pctDiff     = hasCurrent
              ? ((item.currentPrice - item.targetPrice) / item.targetPrice) * 100
              : null
            const belowTarget = pctDiff !== null && pctDiff < 0

            return (
              <div
                key={item._id}
                className="glass-card p-5 flex flex-col gap-3"
                style={{ transition: 'border-color 0.2s' }}
              >
                {/* Card header: symbol + priority + delete */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-lg font-bold" style={{ color: 'var(--gold)' }}>
                      {item.symbol}
                    </div>
                    <div className="text-xs mt-0.5 truncate max-w-40" style={{ color: 'var(--text-muted)' }}>
                      {item.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Priority badge */}
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{ background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}` }}
                    >
                      {item.priority}
                    </span>

                    {/* Delete / confirm */}
                    {confirming ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDeletingId(null)}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                          Yes
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(item._id)}
                        aria-label={`Remove ${item.symbol} from wishlist`}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border)' }} />

                {/* Price section */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      TARGET PRICE
                    </div>
                    <div className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(item.targetPrice)}
                    </div>
                  </div>

                  {hasCurrent && (
                    <div className="text-right">
                      <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                        CURRENT
                      </div>
                      <div className="font-mono text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {formatCurrency(item.currentPrice)}
                      </div>
                      <div
                        className="flex items-center justify-end gap-1 text-xs font-mono mt-0.5"
                        style={{ color: belowTarget ? '#10b981' : '#eab308' }}
                      >
                        {belowTarget
                          ? <TrendingDown size={11} />
                          : <TrendingUp size={11} />}
                        {belowTarget
                          ? `${Math.abs(pctDiff!).toFixed(1)}% below target`
                          : `${pctDiff!.toFixed(1)}% above target`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sector tag */}
                {item.sector && (
                  <div>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(234,179,8,0.06)',
                        color:      'var(--text-muted)',
                        border:     '1px solid var(--border)',
                      }}
                    >
                      {item.sector}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add Wishlist Modal ─────────────────────────────────────────── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wishlist-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className="w-full max-w-lg rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border:     '1px solid var(--border)',
              maxHeight:  '92vh',
              overflowY:  'auto',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Heart size={18} style={{ color: '#eab308' }} />
                <h2
                  id="wishlist-modal-title"
                  className="font-display font-semibold text-lg"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Add to Wishlist
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">

              {/* Symbol + Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    SYMBOL *
                  </label>
                  <input
                    placeholder="AAPL"
                    value={form.symbol}
                    onChange={e => setField('symbol', e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    COMPANY NAME *
                  </label>
                  <input
                    placeholder="Apple Inc."
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Target Price + Current Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    TARGET PRICE *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="165.00"
                    value={form.targetPrice}
                    onChange={e => setField('targetPrice', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    CURRENT PRICE
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="189.84 (optional)"
                    value={form.currentPrice}
                    onChange={e => setField('currentPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Sector + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    SECTOR
                  </label>
                  <select value={form.sector} onChange={e => setField('sector', e.target.value)}>
                    <option value="">Select sector...</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    PRIORITY
                  </label>
                  <select value={form.priority} onChange={e => setField('priority', e.target.value)}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  NOTES
                </label>
                <textarea
                  rows={3}
                  placeholder="Why are you watching this stock? Target entry thesis..."
                  value={form.notes}
                  onChange={e => setField('notes', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Error */}
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

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    color:      '#0d0d0a',
                    opacity:    submitting ? 0.65 : 1,
                    cursor:     submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Adding…' : 'Add to Wishlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

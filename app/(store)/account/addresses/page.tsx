'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  isDefault: boolean
}

export default function AddressesPage() {
  const { t } = useI18n()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Address>>({
    label: 'Shipping Address',
    country: 'United States',
  })

  useEffect(() => {
    fetch('/api/addresses')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setAddresses(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newAddr: Address = {
      ...form as Address,
      id: Date.now().toString(),
    }
    setAddresses([...addresses, newAddr])
    setShowForm(false)
    setForm({ label: 'Shipping Address', country: 'United States' })
  }

  function handleDelete(id: string) {
    setAddresses(addresses.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.addr_title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.addr_subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> {t.addr_add_address}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t.addr_new_address}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_label}</label>
              <input
                required
                type="text"
                value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                placeholder={t.addr_label}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_first_name}</label>
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_last_name}</label>
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_address1}</label>
              <input
                required
                type="text"
                value={form.address1}
                onChange={e => setForm({ ...form, address1: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_address2}</label>
              <input
                type="text"
                value={form.address2}
                onChange={e => setForm({ ...form, address2: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_city}</label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_state}</label>
                <input
                  required
                  type="text"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_zip}</label>
                <input
                  required
                  type="text"
                  value={form.zip}
                  onChange={e => setForm({ ...form, zip: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_country}</label>
                <input
                  required
                  type="text"
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.addr_phone_optional}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand-500 outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary text-sm">{t.addr_save}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">{t.addr_cancel}</button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards */}
      {loading ? (
        <div className="p-8 text-center text-gray-400">{t.addr_loading}</div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">{t.addr_no_addresses}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.addr_add_first_desc}</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm"
          >
            {t.addr_add_first_btn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`card p-5 relative ${addr.isDefault ? 'ring-2 ring-brand-500' : ''}`}
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs bg-brand-100 text-brand-700 font-medium px-2 py-0.5 rounded">
                  {t.addr_default}
                </span>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{addr.label}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.firstName} {addr.lastName}<br />
                    {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                    {addr.city}, {addr.state} {addr.zip}<br />
                    {addr.country}
                    {addr.phone && <><br />{addr.phone}</>}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                <button className="text-xs text-gray-500 hover:text-brand-700 flex items-center gap-1">
                  <Pencil className="w-3 h-3" /> {t.addr_edit}
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> {t.addr_delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

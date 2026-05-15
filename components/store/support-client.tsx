'use client'

import { useState } from 'react'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function SupportClient() {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const faqs = [
    { q: t.support_faq1_q, a: t.support_faq1_a },
    { q: t.support_faq2_q, a: t.support_faq2_a },
    { q: t.support_faq3_q, a: t.support_faq3_a },
    { q: t.support_faq4_q, a: t.support_faq4_a },
    { q: t.support_faq5_q, a: t.support_faq5_a },
  ]

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.support_title}</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t.support_subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="card p-6 text-center">
          <Phone className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t.support_phone}</h3>
          <p className="text-brand-700 font-medium">+1 (800) 000-0000</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.support_phone_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <Mail className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t.support_email}</h3>
          <p className="text-brand-700 font-medium">support@labprostore.com</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.support_email_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <MessageCircle className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t.support_livechat}</h3>
          <p className="text-brand-700 font-medium">{t.support_faq4_q}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.support_livechat_desc}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t.support_faq}</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details key={i} className="card p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center" style={{ color: 'var(--text-primary)' }}>
                {item.q}
                <span className="text-brand-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t.support_contact_title}</h2>
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t.support_sent_title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t.support_sent_desc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.support_name_label}</label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.support_email_label}</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-md px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.support_subject_label}</label>
              <input required type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full rounded-md px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.support_message_label}</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full rounded-md px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none" style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }} />
            </div>
            <button type="submit" className="btn-primary w-full py-3">{t.support_send_btn}</button>
          </form>
        )}
      </div>
    </div>
  )
}

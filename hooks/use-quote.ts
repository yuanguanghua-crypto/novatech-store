import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuoteItem {
  productId: string
  sku: string
  name: string
  quantity: number
  notes?: string
}

interface QuoteStore {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (productId: string) => void
  updateItem: (productId: string, updates: Partial<QuoteItem>) => void
  clearQuote: () => void
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.productId === item.productId)
          if (existing) return state
          return { items: [...state.items, item] }
        })
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),
      updateItem: (productId, updates) =>
        set((state) => ({
          items: state.items.map(i => i.productId === productId ? { ...i, ...updates } : i),
        })),
      clearQuote: () => set({ items: [] }),
    }),
    { name: 'quote-storage' }
  )
)

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string | null | undefined,
  currency = 'USD'
): string {
  if (price === null || price === undefined || price === '') return 'Contact for Price'
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return 'Contact for Price'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${random}`
}

export function generateQuoteNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `QUO-${year}${month}-${random}`
}

// 从规格对象中提取可读标签
export function formatSpecs(specs: Record<string, string> | null | undefined): Array<{ key: string; value: string }> {
  if (!specs) return []
  const SPEC_LABELS: Record<string, string> = {
    spec_max_flow_gph: 'Max Flow (GPH)',
    spec_max_flow_gpd: 'Max Flow (GPD)',
    spec_max_pressure_psi: 'Max Pressure (PSI)',
    spec_product_line: 'Product Line',
    spec_product_type: 'Product Type',
    spec_model_number: 'Model Number',
    spec_brand: 'Brand',
    spec_product_group: 'Product Group',
    spec_voltage: 'Voltage',
    spec_material: 'Material',
    spec_connection_size: 'Connection Size',
    spec_accuracy: 'Accuracy',
    spec_range: 'Range',
    spec_capacity: 'Capacity',
  }
  return Object.entries(specs)
    .filter(([k]) => k !== 'ns_ib_badges' && !k.startsWith('ns_'))
    .map(([key, value]) => ({
      key: SPEC_LABELS[key] || key.replace(/^spec_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: String(value),
    }))
    .filter(({ value }) => value && value.trim() !== '')
}

export function getAvailabilityBadge(availability: string): { label: string; color: string } {
  switch (availability?.toLowerCase()) {
    case 'in_stock':
    case 'in stock':
      return { label: 'In Stock', color: 'green' }
    case 'out_of_stock':
    case 'out of stock':
      return { label: 'Out of Stock', color: 'red' }
    case 'lead_time':
      return { label: 'Lead Time', color: 'yellow' }
    default:
      return { label: 'Contact Us', color: 'gray' }
  }
}

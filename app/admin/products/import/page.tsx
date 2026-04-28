'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileSpreadsheet, AlertCircle, Check, X, Download, Info } from 'lucide-react'

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ row: number; sku: string; error: string }>
}

export default function BulkImportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert('Please select a CSV or Excel file')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setResult(data)

      if (res.ok && data.success > 0) {
        // Refresh product list after successful import
        setTimeout(() => {
          router.refresh()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: 0,
        failed: 1,
        skipped: 0,
        errors: [{ row: 0, sku: '', error: 'Network error' }],
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = async () => {
    try {
      const res = await fetch('/api/admin/products/import')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'product-import-template.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download template:', error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Import Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              Import products from CSV or Excel file
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back to Products
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <h3 className="font-semibold mb-2">Import Instructions</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Download the template CSV file first</li>
              <li>Fill in the product data following the column headers</li>
              <li>SKU must be unique for each product</li>
              <li>Required fields: sku, name, child_category, our_price</li>
              <li>Save as CSV (UTF-8) or Excel format before uploading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Download Template */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Product Import Template</h3>
              <p className="text-sm text-gray-500">CSV format with all required columns</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`bg-white rounded-xl border-2 border-dashed p-8 mb-6 transition-colors ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              <span className="text-brand-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">CSV or Excel files only</p>
          </label>
        </div>

        {file && (
          <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-brand-600" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setResult(null) }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Import Button */}
      {file && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Start Import
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h2>
          
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{result.success}</div>
              <div className="text-sm text-green-700">Imported</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{result.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
              <div className="text-sm text-yellow-700">Skipped</div>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Errors ({result.errors.length})
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg divide-y divide-red-200 max-h-64 overflow-y-auto">
                {result.errors.slice(0, 20).map((error, idx) => (
                  <div key={idx} className="p-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded">
                        Row {error.row}
                      </span>
                      {error.sku && (
                        <span className="font-mono text-gray-700">{error.sku}</span>
                      )}
                    </div>
                    <p className="text-red-700 mt-1">{error.error}</p>
                  </div>
                ))}
                {result.errors.length > 20 && (
                  <div className="p-3 text-sm text-red-600 text-center">
                    ... and {result.errors.length - 20} more errors
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {result.success > 0 && result.failed === 0 && (
            <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
              <Check className="w-5 h-5" />
              <span className="font-medium">All products imported successfully!</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import { importApi } from '../api/client'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'community' | 'property'
  onSuccess: () => void
}

export default function ImportModal({ isOpen, onClose, type, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{
    imported: number
    errors: string[] | null
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const isCommunity = type === 'community'
  const title = isCommunity ? '导入小区' : '导入房源'
  const templateName = isCommunity ? '小区信息模板.xlsx' : '房源信息模板.xlsx'
  const downloadTemplate = isCommunity
    ? importApi.downloadCommunityTemplate
    : importApi.downloadPropertyTemplate

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    try {
      const importFn = isCommunity
        ? importApi.importCommunities
        : importApi.importProperties
      const response = await importFn(file)
      setResult(response)

      if (response.imported > 0) {
        onSuccess()
      }
    } catch (error) {
      console.error('Import failed:', error)
      setResult({
        imported: 0,
        errors: ['导入失败，请检查文件格式是否正确'],
      })
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
            <span className="text-sm text-gray-600">下载模板</span>
            <button
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              下载 {templateName}
            </button>
          </div>

          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {file ? (
                <span className="text-green-600 font-medium">{file.name}</span>
              ) : (
                <span className="text-gray-500">
                  点击选择 Excel 文件 (.xlsx, .xls)
                </span>
              )}
            </label>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-3 rounded-md ${
                result.imported > 0 ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <p
                className={`font-medium ${
                  result.imported > 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                成功导入 {result.imported} 条记录
              </p>
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {result.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? '导入中...' : '导入'}
          </button>
        </div>
      </div>
    </div>
  )
}

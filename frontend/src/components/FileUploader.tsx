import { useState, useRef } from 'react'
import { uploadApi } from '../api/client'

interface FileUploaderProps {
  value: string[] | undefined
  onChange: (files: string[]) => void
  type: 'photo' | 'video'
}

export default function FileUploader({ value = [], onChange, type }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadFn = type === 'photo' ? uploadApi.uploadPhoto : uploadApi.uploadVideo
      const uploadedPaths: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const result = await uploadFn(file)
        uploadedPaths.push(result.url)
      }

      onChange([...value, ...uploadedPaths])
    } catch (err) {
      console.error('Upload failed:', err)
      setError('上传失败，请重试')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  const acceptType = type === 'photo' ? 'image/*' : 'video/*'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptType}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id={`${type}-upload-${Math.random().toString(36).substr(2, 9)}`}
        />
        <label
          htmlFor={`${type}-upload-${Math.random().toString(36).substr(2, 9)}`}
          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : type === 'photo'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {uploading ? '上传中...' : `上传${type === 'photo' ? '照片' : '视频'}`}
        </label>
        <span className="text-sm text-gray-500">
          {type === 'photo' ? '支持 jpg, png, gif, webp' : '支持 mp4, webm, mov'}
        </span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              {type === 'photo' ? (
                <img
                  src={url}
                  alt={`照片 ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              ) : (
                <video
                  src={url}
                  className="w-full h-24 object-cover rounded-md"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

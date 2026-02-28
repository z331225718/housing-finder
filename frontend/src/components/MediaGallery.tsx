import { useState } from 'react'

interface MediaGalleryProps {
  photos?: string[]
  videos?: string[]
}

export default function MediaGallery({ photos = [], videos = [] }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null)

  if (photos.length === 0 && videos.length === 0) {
    return <p className="text-gray-400 text-sm">暂无媒体文件</p>
  }

  return (
    <>
      {/* Media Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {photos.map((url, index) => (
          <button
            key={`photo-${index}`}
            onClick={() => setSelectedMedia({ type: 'photo', url })}
            className="relative aspect-square rounded-md overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src={url}
              alt={`照片 ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        {videos.map((url, index) => (
          <button
            key={`video-${index}`}
            onClick={() => setSelectedMedia({ type: 'video', url })}
            className="relative aspect-square rounded-md overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
          >
            <video src={url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedMedia(null)}
          >
            ×
          </button>

          {selectedMedia.type === 'photo' ? (
            <img
              src={selectedMedia.url}
              alt="查看大图"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={selectedMedia.url}
              controls
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  )
}

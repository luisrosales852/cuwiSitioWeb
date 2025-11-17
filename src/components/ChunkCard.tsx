import type { Chunk } from '../types'

interface ChunkCardProps {
  chunk: Chunk
  isSelected: boolean
  onToggle: (id: string) => void
}

function ChunkCard({ chunk, isSelected, onToggle }: ChunkCardProps) {
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(chunk.id)}
          className="mt-1 h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {chunk.type}
            </span>
            <span className="text-xs text-gray-400">ID: {chunk.id}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {truncateText(chunk.text)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChunkCard

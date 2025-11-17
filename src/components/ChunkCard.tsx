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
    <div
      className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => onToggle(chunk.id)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(chunk.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-md ${
              isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {chunk.type}
            </span>
            <span className="text-xs text-gray-500">ID: {chunk.id}</span>
          </div>
          <p className={`text-sm leading-relaxed ${
            isSelected ? 'text-gray-800' : 'text-gray-700'
          }`}>
            {truncateText(chunk.text)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChunkCard

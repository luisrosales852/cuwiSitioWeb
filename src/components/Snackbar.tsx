interface SnackbarProps {
  message: string
  type: 'success' | 'info' | 'processing'
  isVisible: boolean
}

function Snackbar({ message, type, isVisible }: SnackbarProps) {
  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    processing: 'bg-yellow-500',
  }[type]

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50`}>
      <p className="font-medium">{message}</p>
    </div>
  )
}

export default Snackbar

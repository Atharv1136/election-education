/**
 * Shared loading spinner component.
 * Replaces all inline spinner divs across the app.
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of the spinner
 * @param {boolean} [props.fullPage=false] - Whether to center in full viewport
 */
export default function PageLoader({ size = 'md', fullPage = false }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={`${sizes[size]} border-civic-200 border-t-civic-600 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex justify-center py-12">
      {spinner}
    </div>
  )
}

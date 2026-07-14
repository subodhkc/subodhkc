interface StarRatingProps {
  rating: number
  max?: number
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1}
          className={i < rating ? 'text-yellow-500' : 'text-muted-foreground/30'}
        >
          <path d="M8 1.5l2 4.5 5 .4-3.8 3.3 1.2 4.9L8 12l-4.4 2.6 1.2-4.9L1 6.4l5-.4 2-4.5z" />
        </svg>
      ))}
    </div>
  )
}

export default StarRating

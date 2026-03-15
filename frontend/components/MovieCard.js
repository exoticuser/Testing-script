import Link from 'next/link';

export default function MovieCard({ movie }) {
  const posterSrc = movie.poster || 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=' + encodeURIComponent(movie.title || 'No Image');

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-amber-900/20">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={posterSrc}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=' + encodeURIComponent(movie.title || 'No Image');
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-amber-500 rounded-full p-4">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight">{movie.title}</h3>
            {movie.rating && movie.rating !== 'N/A' && (
              <span className="flex-shrink-0 bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
                {movie.rating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {movie.year && <span className="text-gray-400 text-xs">{movie.year}</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${movie.type === 'tv' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>
              {movie.type === 'tv' ? 'TV' : 'Movie'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

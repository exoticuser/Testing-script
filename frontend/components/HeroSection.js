import Link from 'next/link';

export default function HeroSection({ movie }) {
  if (!movie) return null;

  const backdropSrc = movie.backdrop || movie.poster || 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=StreamFlix';
  const genres = Array.isArray(movie.genres) ? movie.genres : [];

  return (
    <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">
      <img
        src={backdropSrc}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=StreamFlix'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              {genres.map((g) => (
                <span key={g} className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs px-3 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              {movie.year && <span className="text-gray-300 text-sm">{movie.year}</span>}
              {movie.rating && movie.rating !== 'N/A' && (
                <span className="bg-amber-500 text-black text-sm font-bold px-2 py-1 rounded">
                  ★ {movie.rating}
                </span>
              )}
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${movie.type === 'tv' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>
                {movie.type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
            </div>
            {movie.plot && (
              <p className="text-gray-300 text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
                {movie.plot}
              </p>
            )}
            <div className="flex items-center gap-4">
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-all backdrop-blur-sm border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

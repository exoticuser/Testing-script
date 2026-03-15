import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import DownloadSection from '../../components/DownloadSection';

export default function MovieDetail({ movie, error }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">{error || 'Movie not found'}</p>
          <Link href="/" className="text-amber-500 hover:text-amber-400">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const cast = movie.cast ? movie.cast.split(',').map(c => c.trim()) : [];
  const screenshots = Array.isArray(movie.screenshots) ? movie.screenshots : [];
  const downloadLinks = Array.isArray(movie.download_links) ? movie.download_links : [];
  const backdropSrc = movie.backdrop || movie.poster || '';
  const posterSrc = movie.poster || 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=' + encodeURIComponent(movie.title);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Head>
        <title>{movie.title} - StreamFlix</title>
        <meta name="description" content={movie.plot || `Watch ${movie.title} on StreamFlix`} />
      </Head>
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {backdropSrc ? (
          <img src={backdropSrc} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none">
            <img
              src={posterSrc}
              alt={movie.title}
              className="w-48 md:w-64 rounded-xl shadow-2xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image'; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {genres.map((g) => (
                <span key={g} className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs px-3 py-1 rounded-full">{g}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movie.year && <span className="text-gray-300">{movie.year}</span>}
              {movie.rating && movie.rating !== 'N/A' && (
                <span className="bg-amber-500 text-black font-bold px-2 py-1 rounded text-sm">★ {movie.rating}</span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${movie.type === 'tv' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>
                {movie.type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
              {movie.imdb_id && (
                <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 text-sm flex items-center gap-1">
                  IMDb ↗
                </a>
              )}
            </div>
            {movie.plot && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-2">Plot</h2>
                <p className="text-gray-400 leading-relaxed">{movie.plot}</p>
              </div>
            )}
            {cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {cast.map((actor, i) => (
                    <span key={i} className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{actor}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((src, i) => (
                <img key={i} src={src} alt={`Screenshot ${i + 1}`} className="rounded-lg w-full object-cover aspect-video" />
              ))}
            </div>
          </div>
        )}

        {/* Download */}
        <div className="mt-10">
          <DownloadSection downloadLinks={downloadLinks} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const axios = (await import('axios')).default;
    const res = await axios.get(`${API_URL}/api/movies/${params.id}`);
    return { props: { movie: res.data } };
  } catch (err) {
    if (err.response?.status === 404) {
      return { props: { error: 'Movie not found' } };
    }
    return { props: { error: 'Failed to load movie' } };
  }
}

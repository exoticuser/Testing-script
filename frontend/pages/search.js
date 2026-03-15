import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import api from '../lib/api';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) {
      searchMovies(q);
    }
  }, [q]);

  async function searchMovies(query) {
    setLoading(true);
    setSearched(false);
    try {
      const res = await api.get(`/api/movies?search=${encodeURIComponent(query)}&limit=50`);
      setResults(res.data?.movies || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Head>
        <title>{q ? `Search: ${q}` : 'Search'} - StreamFlix</title>
      </Head>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {q ? (
              <>Search results for <span className="text-amber-500">&quot;{q}&quot;</span></>
            ) : (
              'Search'
            )}
          </h1>
          {searched && (
            <p className="text-gray-400 mt-2">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-xl">No results found for &quot;{q}&quot;</p>
            <p className="text-gray-600 mt-2">Try a different search term.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

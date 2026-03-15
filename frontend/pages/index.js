import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import api from '../lib/api';

export default function Home({ initialFeatured, initialTrending, initialMovies, initialSeries }) {
  const [featured, setFeatured] = useState(initialFeatured || []);
  const [trending, setTrending] = useState(initialTrending || []);
  const [movies, setMovies] = useState(initialMovies || []);
  const [series, setSeries] = useState(initialSeries || []);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(!initialFeatured);

  useEffect(() => {
    if (!initialFeatured) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (featured.length > 1) {
      const timer = setInterval(() => {
        setHeroIndex((i) => (i + 1) % featured.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [featured]);

  async function fetchData() {
    setLoading(true);
    try {
      const [featuredRes, trendingRes, moviesRes, seriesRes] = await Promise.all([
        api.get('/api/movies/featured'),
        api.get('/api/movies/trending'),
        api.get('/api/movies?type=movie&limit=12'),
        api.get('/api/movies?type=tv&limit=12'),
      ]);
      setFeatured(featuredRes.data || []);
      setTrending(trendingRes.data || []);
      setMovies(moviesRes.data?.movies || []);
      setSeries(seriesRes.data?.movies || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }

  const heroMovie = featured[heroIndex] || null;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Head>
        <title>StreamFlix - Stream Movies &amp; TV Series</title>
        <meta name="description" content="Watch and download movies and TV series online" />
      </Head>
      <Navbar />

      {loading ? (
        <div className="h-[85vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading StreamFlix...</p>
          </div>
        </div>
      ) : (
        <>
          {heroMovie && <HeroSection movie={heroMovie} />}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {trending.length > 0 && (
              <section className="mt-8 mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-amber-500">🔥</span> Trending Now
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {trending.map((movie) => (
                    <div key={movie.id} className="flex-none w-40">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {movies.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">🎬</span> Latest Movies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            )}

            {series.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-blue-400">📺</span> Latest TV Series
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {series.map((show) => (
                    <MovieCard key={show.id} movie={show} />
                  ))}
                </div>
              </section>
            )}

            {!loading && trending.length === 0 && movies.length === 0 && series.length === 0 && (
              <div className="text-center py-24">
                <p className="text-gray-500 text-xl">No content available yet.</p>
                <p className="text-gray-600 mt-2">Visit the admin panel to add movies and TV series.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const axios = (await import('axios')).default;
    const [featuredRes, trendingRes, moviesRes, seriesRes] = await Promise.all([
      axios.get(`${API_URL}/api/movies/featured`).catch(() => ({ data: [] })),
      axios.get(`${API_URL}/api/movies/trending`).catch(() => ({ data: [] })),
      axios.get(`${API_URL}/api/movies?type=movie&limit=12`).catch(() => ({ data: { movies: [] } })),
      axios.get(`${API_URL}/api/movies?type=tv&limit=12`).catch(() => ({ data: { movies: [] } })),
    ]);
    return {
      props: {
        initialFeatured: featuredRes.data || [],
        initialTrending: trendingRes.data || [],
        initialMovies: moviesRes.data?.movies || [],
        initialSeries: seriesRes.data?.movies || [],
      },
    };
  } catch {
    return {
      props: {
        initialFeatured: [],
        initialTrending: [],
        initialMovies: [],
        initialSeries: [],
      },
    };
  }
}

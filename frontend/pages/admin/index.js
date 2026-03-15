import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({ total: 0, movies: 0, series: 0 });
  const [loading, setLoading] = useState(true);
  const [fetchTitle, setFetchTitle] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
    }
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const res = await api.get('/api/movies?limit=100');
      const allMovies = res.data?.movies || [];
      setMovies(allMovies.slice(0, 20));
      setStats({
        total: allMovies.length,
        movies: allMovies.filter(m => m.type === 'movie').length,
        series: allMovies.filter(m => m.type === 'tv').length,
      });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/api/movies/${id}`);
      setMovies(prev => prev.filter(m => m.id !== id));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        movies: prev.movies - (movies.find(m => m.id === id)?.type === 'movie' ? 1 : 0),
        series: prev.series - (movies.find(m => m.id === id)?.type === 'tv' ? 1 : 0),
      }));
    } catch (err) {
      alert('Failed to delete. Please try again.');
    }
  }

  async function handleQuickFetch(e) {
    e.preventDefault();
    if (!fetchTitle.trim()) return;
    setFetchLoading(true);
    setFetchedData(null);
    try {
      const res = await api.post('/api/movies/fetch-imdb', { title: fetchTitle });
      setFetchedData(res.data);
    } catch (err) {
      alert('Failed to fetch metadata');
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleQuickSave() {
    if (!fetchedData) return;
    try {
      await api.post('/api/movies', {
        ...fetchedData,
        download_links: [
          { quality: '480p', url: '#', size: 'N/A' },
          { quality: '720p', url: '#', size: 'N/A' },
          { quality: '1080p', url: '#', size: 'N/A' },
        ]
      });
      setFetchedData(null);
      setFetchTitle('');
      fetchData();
      alert('Content added successfully!');
    } catch (err) {
      alert('Failed to save content');
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Head><title>Admin Dashboard - StreamFlix</title></Head>

      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-500">StreamFlix Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm">View Site</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Content', value: stats.total, cls: 'text-amber-500' },
            { label: 'Movies', value: stats.movies, cls: 'text-purple-500' },
            { label: 'TV Series', value: stats.series, cls: 'text-blue-500' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm">{label}</p>
              <p className={`text-4xl font-bold mt-2 ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Fetch */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Quick Add Content</h2>
          <form onSubmit={handleQuickFetch} className="flex gap-3 mb-4">
            <input
              type="text"
              value={fetchTitle}
              onChange={(e) => setFetchTitle(e.target.value)}
              placeholder="Enter movie/series title..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
            />
            <button
              type="submit"
              disabled={fetchLoading}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold px-6 py-2 rounded-lg transition-colors"
            >
              {fetchLoading ? 'Fetching...' : 'Fetch Metadata'}
            </button>
          </form>
          {fetchedData && (
            <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-4">
              {fetchedData.poster && (
                <img src={fetchedData.poster} alt={fetchedData.title} className="w-16 rounded" onError={(e) => { e.target.style.display='none'; }} />
              )}
              <div className="flex-1">
                <p className="text-white font-bold">{fetchedData.title}</p>
                <p className="text-gray-400 text-sm">{fetchedData.year} · {fetchedData.type} · ★{fetchedData.rating}</p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{fetchedData.plot}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleQuickSave} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Save
                </button>
                <button onClick={() => router.push({ pathname: '/admin/add', query: { prefill: JSON.stringify(fetchedData) } })} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Edit &amp; Save
                </button>
                <button onClick={() => setFetchedData(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Content</h2>
          <Link href="/admin/add" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
            + Add Content
          </Link>
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Title</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-4 hidden md:table-cell">Type</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-4 hidden md:table-cell">Year</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-4 hidden lg:table-cell">Rating</th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, idx) => (
                <tr key={movie.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {movie.poster && (
                        <img src={movie.poster} alt="" className="w-8 h-12 object-cover rounded hidden sm:block" onError={(e) => { e.target.style.display='none'; }} />
                      )}
                      <span className="text-white text-sm font-medium">{movie.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${movie.type === 'tv' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>
                      {movie.type === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-gray-400 text-sm">{movie.year || '-'}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {movie.rating && movie.rating !== 'N/A' ? (
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded">★ {movie.rating}</span>
                    ) : (
                      <span className="text-gray-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/movie/${movie.id}`} className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                        View
                      </Link>
                      <Link href={`/admin/edit/${movie.id}`} className="text-amber-400 hover:text-amber-300 text-sm px-3 py-1 rounded bg-amber-900/20 hover:bg-amber-900/40 transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(movie.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded bg-red-900/20 hover:bg-red-900/40 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No content yet. <Link href="/admin/add" className="text-amber-500 hover:text-amber-400">Add some content</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

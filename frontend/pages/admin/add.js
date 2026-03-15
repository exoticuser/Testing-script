import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

const QUALITIES = ['480p', '720p', '1080p', '4K'];

export default function AddContent() {
  const router = useRouter();
  const [fetchQuery, setFetchQuery] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'movie', imdb_id: '', year: '', rating: '',
    plot: '', poster: '', backdrop: '', cast: '', genres: '',
    featured: false, trending: false,
  });
  const [downloadLinks, setDownloadLinks] = useState(
    QUALITIES.map(q => ({ quality: q, url: '', size: '' }))
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) { router.push('/admin/login'); return; }
      if (router.query.prefill) {
        try {
          const data = JSON.parse(router.query.prefill);
          prefillForm(data);
        } catch (e) {
          console.error('Failed to parse prefill data', e);
        }
      }
    }
  }, [router]);

  function prefillForm(data) {
    setForm({
      title: data.title || '',
      type: data.type || 'movie',
      imdb_id: data.imdb_id || '',
      year: data.year || '',
      rating: data.rating || '',
      plot: data.plot || '',
      poster: data.poster || '',
      backdrop: data.backdrop || '',
      cast: data.cast || '',
      genres: Array.isArray(data.genres) ? data.genres.join(', ') : (data.genres || ''),
      featured: data.featured || false,
      trending: data.trending || false,
    });
  }

  async function handleFetch(e) {
    e.preventDefault();
    if (!fetchQuery.trim()) return;
    setFetchLoading(true);
    try {
      const isImdb = fetchQuery.startsWith('tt');
      const body = isImdb ? { imdb_id: fetchQuery } : { title: fetchQuery };
      const res = await api.post('/api/movies/fetch-imdb', body);
      prefillForm(res.data);
    } catch (err) {
      alert('Failed to fetch metadata. Please fill in details manually.');
    } finally {
      setFetchLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleLinkChange(index, field, value) {
    setDownloadLinks(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title) { alert('Title is required'); return; }
    setSaving(true);
    try {
      const genres = form.genres ? form.genres.split(',').map(g => g.trim()).filter(Boolean) : [];
      const links = downloadLinks.filter(l => l.url);
      await api.post('/api/movies', { ...form, genres, download_links: links });
      router.push('/admin');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Head><title>Add Content - StreamFlix Admin</title></Head>
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-amber-500 font-bold text-xl">StreamFlix Admin</Link>
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Back to Dashboard</Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Add New Content</h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Fetch from OMDb / IMDb</h2>
          <form onSubmit={handleFetch} className="flex gap-3">
            <input
              type="text"
              value={fetchQuery}
              onChange={(e) => setFetchQuery(e.target.value)}
              placeholder="Movie title or IMDb ID (e.g. tt0468569)..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700"
            />
            <button type="submit" disabled={fetchLoading} className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold px-6 py-2 rounded-lg transition-colors">
              {fetchLoading ? 'Fetching...' : 'Fetch'}
            </button>
          </form>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="movie">Movie</option>
                  <option value="tv">TV Series</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">IMDb ID</label>
                <input name="imdb_id" value={form.imdb_id} onChange={handleChange} placeholder="tt0000000" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Year</label>
                <input name="year" value={form.year} onChange={handleChange} placeholder="2024" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Rating (IMDb)</label>
                <input name="rating" value={form.rating} onChange={handleChange} placeholder="8.5" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Genres (comma-separated)</label>
                <input name="genres" value={form.genres} onChange={handleChange} placeholder="Action, Drama, Sci-Fi" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Cast (comma-separated)</label>
                <input name="cast" value={form.cast} onChange={handleChange} placeholder="Actor 1, Actor 2" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Plot</label>
                <textarea name="plot" value={form.plot} onChange={handleChange} rows={3} className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Poster URL</label>
                <input name="poster" value={form.poster} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Backdrop URL</label>
                <input name="backdrop" value={form.backdrop} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-amber-500" />
                  <span className="text-gray-300 text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="w-4 h-4 accent-amber-500" />
                  <span className="text-gray-300 text-sm">Trending</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-4">Download Links</h2>
            <div className="space-y-3">
              {downloadLinks.map((link, i) => (
                <div key={link.quality} className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold w-12 text-sm flex-shrink-0">{link.quality}</span>
                  <input
                    value={link.url}
                    onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                    placeholder="Download URL"
                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <input
                    value={link.size}
                    onChange={(e) => handleLinkChange(i, 'size', e.target.value)}
                    placeholder="Size (e.g. 1.2GB)"
                    className="w-32 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold px-8 py-3 rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Save Content'}
            </button>
            <Link href="/admin" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

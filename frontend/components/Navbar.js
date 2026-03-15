import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-amber-500">
              StreamFlix
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/?type=movie" className="text-gray-300 hover:text-white transition-colors">
                Movies
              </Link>
              <Link href="/?type=tv" className="text-gray-300 hover:text-white transition-colors">
                TV Series
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <Link href="/admin" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
              Admin
            </Link>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black/95 rounded-lg mb-4 p-4">
            <div className="flex flex-col gap-4">
              <SearchBar />
              <Link href="/" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/?type=movie" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Movies</Link>
              <Link href="/?type=tv" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>TV Series</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

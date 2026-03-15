export default function DownloadSection({ downloadLinks }) {
  if (!downloadLinks || downloadLinks.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Download</h2>
        <p className="text-gray-400">No download links available.</p>
      </div>
    );
  }

  const qualityColors = {
    '4K': 'from-purple-600 to-purple-800 border-purple-500',
    '1080p': 'from-blue-600 to-blue-800 border-blue-500',
    '720p': 'from-green-600 to-green-800 border-green-500',
    '480p': 'from-amber-600 to-amber-800 border-amber-500',
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Links
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {downloadLinks.map((link, index) => (
          <a
            key={index}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b border ${qualityColors[link.quality] || 'from-gray-700 to-gray-900 border-gray-600'} hover:opacity-90 transition-all hover:scale-105 group`}
          >
            <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">
              {link.quality}
            </span>
            {link.size && (
              <span className="text-white/70 text-xs mt-1">{link.size}</span>
            )}
            <svg className="w-4 h-4 text-white/60 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

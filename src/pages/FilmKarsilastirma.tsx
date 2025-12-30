import React, { useState } from 'react';
import { Search, Clock, Award, MoveRight, X } from 'lucide-react';
import { searchMovies, getMovieDetails } from '../services/api';

interface FilmKarsilastirmaProps {
  theme?: 'light' | 'dark';
}

const FilmKarsilastirma: React.FC<FilmKarsilastirmaProps> = ({ theme = 'light' }) => {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [searchResults1, setSearchResults1] = useState<any[]>([]);
  const [searchResults2, setSearchResults2] = useState<any[]>([]);
  const [filmData1, setFilmData1] = useState<any>(null);
  const [filmData2, setFilmData2] = useState<any>(null);

  const isDark = theme === 'dark';

  const handleSearch = async (query: string, setResults: (results: any[]) => void) => {
    if (query.trim().length > 2) {
      const results = await searchMovies(query);
      setResults(results);
    } else {
      setResults([]);
    }
  };

  const selectMovie = async (id: number, setFilmData: (data: any) => void, setResults: (r: any[]) => void, setQuery: (q: string) => void) => {
    const details = await getMovieDetails(id);
    setFilmData(details);
    setResults([]);
    setQuery(details.title);
  };

  const showComparison = filmData1 && filmData2;

  // Theme-aware classes
  const cardClass = isDark
    ? "bg-gray-800 border-gray-700 shadow-xl"
    : "bg-white border-gray-100 shadow-md";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-600";
  const inputClass = isDark
    ? "bg-gray-900 border-gray-700 text-white focus:ring-blue-500/50"
    : "bg-gray-50 border-gray-200 focus:ring-blue-500/50";
  const searchResultClass = isDark
    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Movie Comparison</h1>
          <p className="text-blue-100 max-w-xl">
            Analyze two movies side-by-side in detail. Compare ratings, directors, cast, and box office numbers.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* Film Selection */}
      <div className={`${cardClass} p-6 rounded-2xl border relative z-20`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">

          {/* Movie 1 Input */}
          <div className="relative">
            <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Movie 1</label>
            <div className="relative">
              <input
                type="text"
                value={query1}
                onChange={(e) => {
                  setQuery1(e.target.value);
                  handleSearch(e.target.value, setSearchResults1);
                }}
                placeholder="Search first movie..."
                className={`w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-4 transition-all ${inputClass}`}
              />
              <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
              {filmData1 && (
                <button
                  onClick={() => { setFilmData1(null); setQuery1(''); }}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {searchResults1.length > 0 && (
              <div className={`absolute top-full left-0 right-0 border mt-2 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {searchResults1.map(movie => (
                  <div
                    key={movie.id}
                    className={`p-3 cursor-pointer flex items-center space-x-4 border-b last:border-0 transition-colors ${searchResultClass}`}
                    onClick={() => selectMovie(movie.id, setFilmData1, setSearchResults1, setQuery1)}
                  >
                    {movie.imageUrl ? (
                      <img src={movie.imageUrl} alt={movie.title} className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className={`w-10 h-14 rounded flex items-center justify-center text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>No Img</div>
                    )}
                    <div>
                      <p className="font-bold text-sm">{movie.title}</p>
                      <p className="text-xs opacity-60">{movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Movie 2 Input */}
          <div className="relative">
            <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Movie 2</label>
            <div className="relative">
              <input
                type="text"
                value={query2}
                onChange={(e) => {
                  setQuery2(e.target.value);
                  handleSearch(e.target.value, setSearchResults2);
                }}
                placeholder="Search second movie..."
                className={`w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-4 transition-all ${inputClass}`}
              />
              <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
              {filmData2 && (
                <button
                  onClick={() => { setFilmData2(null); setQuery2(''); }}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {searchResults2.length > 0 && (
              <div className={`absolute top-full left-0 right-0 border mt-2 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {searchResults2.map(movie => (
                  <div
                    key={movie.id}
                    className={`p-3 cursor-pointer flex items-center space-x-4 border-b last:border-0 transition-colors ${searchResultClass}`}
                    onClick={() => selectMovie(movie.id, setFilmData2, setSearchResults2, setQuery2)}
                  >
                    {movie.imageUrl ? (
                      <img src={movie.imageUrl} alt={movie.title} className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className={`w-10 h-14 rounded flex items-center justify-center text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>No Img</div>
                    )}
                    <div>
                      <p className="font-bold text-sm">{movie.title}</p>
                      <p className="text-xs opacity-60">{movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!showComparison && (
          <div className="mt-8 flex justify-center text-gray-500 italic text-sm">
            <p className="flex items-center gap-2">
              Select two movies to see key differences <MoveRight className="animate-pulse" size={16} />
            </p>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {showComparison && (
        <div className={`${cardClass} rounded-2xl border overflow-hidden animate-slideUp`}>
          <div className={`${isDark ? 'bg-gray-900/50' : 'bg-blue-50'} p-6 border-b ${isDark ? 'border-gray-700' : 'border-blue-100'}`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Side-by-Side Analysis</h2>
          </div>

          {/* Film Headers */}
          <div className={`grid grid-cols-2 gap-4 p-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex flex-col items-center">
              <div className="h-56 w-36 md:h-72 md:w-48 overflow-hidden rounded-2xl mb-4 shadow-2xl ring-4 ring-blue-500/20">
                <img
                  src={filmData1.imageUrl}
                  alt={filmData1.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <h3 className={`text-xl md:text-2xl font-black text-center ${textClass}`}>{filmData1.title}</h3>
              <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{filmData1.year}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-56 w-36 md:h-72 md:w-48 overflow-hidden rounded-2xl mb-4 shadow-2xl ring-4 ring-blue-500/20">
                <img
                  src={filmData2.imageUrl}
                  alt={filmData2.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <h3 className={`text-xl md:text-2xl font-black text-center ${textClass}`}>{filmData2.title}</h3>
              <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{filmData2.year}</p>
            </div>
          </div>

          {/* Comparison Metrics */}
          <div className="p-8 space-y-8">
            {/* IMDb Rating */}
            <div className="grid grid-cols-2 gap-8">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-1">
                  <Award className="text-yellow-500" size={20} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${subTextClass}`}>Cinema Rating</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-black ${filmData1.rating > filmData2.rating ? 'text-green-500' : textClass}`}>
                    {filmData1.rating.toFixed(1)}
                  </p>
                  {filmData1.rating > filmData2.rating && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Winner</span>}
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-1">
                  <Award className="text-yellow-500" size={20} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${subTextClass}`}>Cinema Rating</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-black ${filmData2.rating > filmData1.rating ? 'text-green-500' : textClass}`}>
                    {filmData2.rating.toFixed(1)}
                  </p>
                  {filmData2.rating > filmData1.rating && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Winner</span>}
                </div>
              </div>
            </div>

            {/* Director */}
            <div className="grid grid-cols-2 gap-8 text-center md:text-left">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Director</p>
                <p className={`text-lg font-bold ${textClass}`}>{filmData1.director}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Director</p>
                <p className={`text-lg font-bold ${textClass}`}>{filmData2.director}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${subTextClass}`}>Duration</p>
                  <p className={`font-bold ${textClass}`}>{filmData1.duration} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${subTextClass}`}>Duration</p>
                  <p className={`font-bold ${textClass}`}>{filmData2.duration} min</p>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${subTextClass}`}>Genres</p>
                <div className="flex flex-wrap gap-2">
                  {filmData1.genres.map((genre: string, index: number) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${subTextClass}`}>Genres</p>
                <div className="flex flex-wrap gap-2">
                  {filmData2.genres.map((genre: string, index: number) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cast */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${subTextClass}`}>Key Cast</p>
                <div className="space-y-2">
                  {filmData1.cast.slice(0, 3).map((actor: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm font-medium ${textClass}`}>{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${subTextClass}`}>Key Cast</p>
                <div className="space-y-2">
                  {filmData2.cast.slice(0, 3).map((actor: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm font-medium ${textClass}`}>{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget & Box Office */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl ${isDark ? 'bg-indigo-900/20' : 'bg-blue-50/50'}`}>
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Budget</p>
                  <p className={`text-lg font-black ${textClass}`}>{filmData1.budget}</p>
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Box Office</p>
                  <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>{filmData1.boxOffice}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Budget</p>
                  <p className={`text-lg font-black ${textClass}`}>{filmData2.budget}</p>
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Box Office</p>
                  <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>{filmData2.boxOffice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmKarsilastirma;
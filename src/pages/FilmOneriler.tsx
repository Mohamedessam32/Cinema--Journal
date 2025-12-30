import React, { useEffect, useState } from 'react';
import { Search, ThumbsUp, Sparkles, Trash2, Loader2, Plus } from 'lucide-react';
import FilmCard from '../components/FilmCard';
import { fetchSmartRecommendations, searchMovies } from '../services/api';

interface FilmOnerilerProps {
  theme?: 'light' | 'dark';
  onMovieSelect?: (id: number) => void;
}

const FilmOneriler: React.FC<FilmOnerilerProps> = ({ theme = 'light', onMovieSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const isDark = theme === 'dark';

  // Load recommendations based on the most recently liked movie
  useEffect(() => {
    if (likedMovies.length > 0) {
      const getRecs = async () => {
        setIsLoadingRecs(true);
        const lastLiked = likedMovies[likedMovies.length - 1];
        const recs = await fetchSmartRecommendations(lastLiked.id);
        setRecommendations(recs);
        setIsLoadingRecs(false);
      };
      getRecs();
    } else {
      setRecommendations([]);
    }
  }, [likedMovies]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchMovies(searchQuery);
    setSearchResults(results.slice(0, 5));
    setIsSearching(false);
  };

  const addLikedMovie = (movie: any) => {
    if (!likedMovies.find(m => m.id === movie.id)) {
      setLikedMovies([...likedMovies, movie]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeLikedMovie = (id: number) => {
    setLikedMovies(likedMovies.filter(m => m.id !== id));
  };

  const bgClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-yellow-300" />
            AI Recommendations
          </h1>
          <p className="text-blue-50 max-w-2xl text-lg">
            Add movies you've enjoyed, and our engine will find similar films matching their genres and cast.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Likes & Search */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Section */}
          <div className={`${bgClass} p-6 rounded-2xl border shadow-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${textClass} flex items-center gap-2`}>
              <Plus className="text-blue-500" size={20} />
              Add Liked Movies
            </h2>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search favorite movie..."
                className={`w-full px-4 py-3 pl-10 rounded-xl border transition-all ${isDark
                    ? "bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                    : "bg-gray-50 border-gray-200 focus:border-blue-500"
                  }`}
              />
              <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
              {isSearching && <Loader2 className="absolute right-3 top-3.5 animate-spin text-blue-500" size={18} />}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className={`absolute z-20 w-[calc(100%-3rem)] mt-[-10px] ${isDark ? 'bg-gray-800' : 'bg-white'} border rounded-xl overflow-hidden shadow-2xl`}>
                {searchResults.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => addLikedMovie(movie)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b last:border-0 ${isDark ? 'hover:bg-gray-700 border-gray-700 text-white' : 'hover:bg-blue-50 border-gray-100 text-gray-900'
                      }`}
                  >
                    <img src={movie.imageUrl} className="w-10 h-14 object-cover rounded" alt="" />
                    <div>
                      <div className="font-semibold text-sm">{movie.title}</div>
                      <div className="text-xs opacity-60">{movie.year}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Liked List */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider text-blue-500`}>Your List</h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">
                  {likedMovies.length} movies
                </span>
              </div>

              {likedMovies.length === 0 ? (
                <div className={`text-center py-8 border-2 border-dashed rounded-xl ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <ThumbsUp className="mx-auto text-gray-400 mb-2 opacity-30" size={32} />
                  <p className="text-xs text-gray-500">No movies added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {likedMovies.map(movie => (
                    <div
                      key={movie.id}
                      className={`flex items-center gap-3 p-2 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      <img src={movie.imageUrl} className="w-8 h-12 object-cover rounded shadow" alt="" />
                      <div className="flex-grow min-w-0">
                        <div className={`font-bold text-sm truncate ${textClass}`}>{movie.title}</div>
                        <div className="text-[10px] text-gray-500">{movie.year}</div>
                      </div>
                      <button
                        onClick={() => removeLikedMovie(movie.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2">
          {likedMovies.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center text-center p-12 ${bgClass} rounded-2xl border border-dashed`}>
              <Sparkles className="text-blue-500 opacity-20 mb-4" size={64} />
              <h2 className={`text-2xl font-bold mb-2 ${textClass}`}>Waiting for your input</h2>
              <p className={subTextClass}>Add a movie you enjoy to generate recommendations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${textClass}`}>Recommended for You</h2>
                {isLoadingRecs && <Loader2 className="animate-spin text-blue-500" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendations.map((movie, idx) => (
                  <FilmCard
                    key={`${movie.id}-${idx}`}
                    {...movie}
                    theme={theme}
                    onClick={() => onMovieSelect?.(movie.id)}
                  />
                ))}
              </div>

              {recommendations.length === 0 && !isLoadingRecs && (
                <div className="text-center py-20">
                  <p className={subTextClass}>Analyzing data... Try adding another movie if nothing shows up.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmOneriler;
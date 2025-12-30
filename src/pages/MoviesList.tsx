import React, { useEffect, useState } from 'react';
import FilmCard from '../components/FilmCard';
import { fetchMovies, fetchMoviesByGenre, fetchGenres, searchMovies } from '../services/api';
import { ArrowLeft, ChevronLeft, ChevronRight, Video, Search, X } from 'lucide-react';

interface MoviesListProps {
    onBack: () => void;
    type?: 'popular' | 'top_rated' | 'now_playing' | 'famous';
    genreId?: number;
    title: string;
    onMovieSelect?: (id: number) => void;
    filterMode?: boolean;
    theme?: 'light' | 'dark';
}

const MoviesList: React.FC<MoviesListProps> = ({ onBack, type = 'popular', genreId, title, onMovieSelect, filterMode = false, theme = 'light' }) => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
    const [selectedGenreId, setSelectedGenreId] = useState<number | null>(genreId || null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        if (filterMode) {
            const loadGenres = async () => {
                const genreMap = await fetchGenres();
                const genreList = Object.entries(genreMap).map(([id, name]) => ({
                    id: Number(id),
                    name: String(name),
                }));
                genreList.sort((a, b) => a.name.localeCompare(b.name));
                setGenres(genreList);
            };
            loadGenres();
        }
    }, [filterMode]);

    useEffect(() => {
        // Don't load normal movies if in search mode
        if (isSearchMode) return;

        const loadMovies = async () => {
            setLoading(true);
            window.scrollTo(0, 0);

            const startPage = (page - 1) * 5 + 1;
            const promises = [];
            const activeId = filterMode ? selectedGenreId : genreId;

            for (let i = 0; i < 5; i++) {
                if (activeId) {
                    promises.push(fetchMoviesByGenre(activeId, startPage + i));
                } else {
                    promises.push(fetchMovies(type, undefined, startPage + i));
                }
            }

            try {
                const results = await Promise.all(promises);
                const allMovies = results.flat();
                setMovies(allMovies);
            } catch (error) {
                console.error("Failed to load movies", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [type, genreId, selectedGenreId, page, filterMode, isSearchMode]);

    // Search handler
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            clearSearch();
            return;
        }
        setIsSearching(true);
        setIsSearchMode(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchMode(false);
    };

    const isDark = theme === 'dark';
    const filterBarClass = isDark
        ? "flex bg-gray-800 p-4 rounded-xl shadow-sm overflow-x-auto pb-4 gap-2 scrollbar-hide"
        : "flex bg-white p-4 rounded-xl shadow-sm overflow-x-auto pb-4 gap-2 scrollbar-hide";
    const buttonInactiveClass = isDark
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200";
    const titleClass = isDark ? "text-3xl font-bold text-white" : "text-3xl font-bold text-gray-900";
    const backButtonClass = isDark
        ? "p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
        : "p-2 hover:bg-gray-200 rounded-full transition-colors";
    const searchBarClass = isDark
        ? "bg-gray-800 p-4 rounded-xl shadow-sm"
        : "bg-white p-4 rounded-xl shadow-sm";
    const inputClass = isDark
        ? "flex-grow px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        : "flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    const subTextClass = isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm";
    const paginationTextClass = isDark ? "text-lg font-semibold text-gray-300" : "text-lg font-semibold text-gray-700";
    const paginationBtnClass = isDark
        ? "px-4 py-2 font-medium bg-gray-800 text-blue-400 shadow hover:bg-gray-700 rounded-full flex items-center"
        : "px-4 py-2 font-medium bg-white text-blue-600 shadow hover:bg-blue-50 rounded-full flex items-center";
    const paginationDisabledClass = isDark
        ? "px-4 py-2 font-medium bg-gray-700 text-gray-500 cursor-not-allowed rounded-full flex items-center"
        : "px-4 py-2 font-medium bg-gray-100 text-gray-400 cursor-not-allowed rounded-full flex items-center";

    const displayedMovies = isSearchMode ? searchResults : movies;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className={backButtonClass}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className={titleClass}>{title}</h1>
                </div>

                {/* Search Bar */}
                <div className={searchBarClass}>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search for a movie..."
                            className={inputClass}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {isSearchMode && (
                            <button
                                onClick={clearSearch}
                                className="px-3 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                                title="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Search size={18} className="mr-2" />
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Search results info */}
                {isSearchMode && (
                    <p className={subTextClass}>
                        Found {searchResults.length} results for "{searchQuery}"
                    </p>
                )}

                {filterMode && !isSearchMode && (
                    <div className={filterBarClass}>
                        <button
                            onClick={() => setSelectedGenreId(null)}
                            className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedGenreId === null
                                ? 'bg-blue-600 text-white'
                                : buttonInactiveClass
                                }`}
                        >
                            <Video size={16} className="mr-2" />
                            All Movies
                        </button>
                        {genres.map(g => (
                            <button
                                key={g.id}
                                onClick={() => {
                                    setSelectedGenreId(g.id);
                                    setPage(1);
                                }}
                                className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedGenreId === g.id
                                    ? 'bg-blue-600 text-white'
                                    : buttonInactiveClass
                                    }`}
                            >
                                <Video size={16} className="mr-2" />
                                {g.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading || isSearching ? (
                <div className="flex h-96 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {displayedMovies.map((film, index) => (
                            <FilmCard
                                key={`${film.id}-${index}`}
                                {...film}
                                theme={theme}
                                onClick={() => onMovieSelect?.(film.id)}
                            />
                        ))}
                    </div>

                    {displayedMovies.length === 0 && (
                        <div className="text-center py-12">
                            <p className={subTextClass}>No movies found.</p>
                        </div>
                    )}

                    {/* Pagination Controls - Hide when in search mode */}
                    {!isSearchMode && (
                        <div className="flex justify-center items-center space-x-4 pt-8 pb-12">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={page === 1 ? paginationDisabledClass : paginationBtnClass}
                            >
                                <ChevronLeft size={20} className="mr-1" /> Previous
                            </button>
                            <span className={paginationTextClass}>Page {page}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className={paginationBtnClass}
                            >
                                Next <ChevronRight size={20} className="ml-1" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MoviesList;

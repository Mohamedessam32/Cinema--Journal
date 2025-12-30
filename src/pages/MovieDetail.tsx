import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';
import { getMovieDetails } from '../services/api';

interface MovieDetailProps {
    movieId: number;
    onBack: () => void;
    theme?: 'light' | 'dark';
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId, onBack, theme = 'light' }) => {
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadMovie = async () => {
            setLoading(true);
            const data = await getMovieDetails(movieId);
            setMovie(data);
            setLoading(false);
        };
        if (movieId) {
            loadMovie();
        }
    }, [movieId]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="text-center py-12">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Movie not found</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    // Theme-based classes
    const cardClass = isDark
        ? "bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        : "bg-white rounded-2xl shadow-xl overflow-hidden";
    const titleClass = isDark ? "text-4xl font-bold text-white mb-2" : "text-4xl font-bold text-gray-900 mb-2";
    const subtitleClass = isDark ? "text-xl text-gray-400 mb-6" : "text-xl text-gray-500 mb-6";
    const overviewTitleClass = isDark ? "text-lg font-semibold mb-2 text-white" : "text-lg font-semibold mb-2";
    const overviewTextClass = isDark ? "text-gray-300 leading-relaxed text-lg mb-6" : "text-gray-700 leading-relaxed text-lg mb-6";
    const genreClass = isDark
        ? "px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium"
        : "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium";
    const ratingBadgeClass = isDark
        ? "flex items-center bg-yellow-900 px-3 py-1 rounded-full"
        : "flex items-center bg-yellow-100 px-3 py-1 rounded-full";
    const ratingTextClass = isDark ? "font-bold text-yellow-300" : "font-bold text-yellow-700";
    const backButtonClass = isDark
        ? "flex items-center text-gray-300 hover:text-blue-400 transition-colors"
        : "flex items-center text-gray-600 hover:text-blue-600 transition-colors";
    const borderClass = isDark ? "border-gray-700" : "border-gray-100";
    const labelClass = isDark ? "flex items-center text-gray-400 mb-1" : "flex items-center text-gray-500 mb-1";
    const valueClass = isDark ? "font-semibold text-white" : "font-semibold";

    return (
        <div className="space-y-8 animate-fadeIn">
            <button
                onClick={onBack}
                className={backButtonClass}
            >
                <ArrowLeft className="mr-2" size={20} />
                Back to List
            </button>

            {/* Hero Section */}
            <div className={cardClass}>
                <div className="md:flex">
                    <div className="md:w-1/3 h-96 md:h-auto relative">
                        <img
                            src={movie.imageUrl || 'https://via.placeholder.com/500x750?text=No+Image'}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-2/3 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className={titleClass}>{movie.title}</h1>
                                <div className={ratingBadgeClass}>
                                    <Star className="text-yellow-500 mr-1" size={20} />
                                    <span className={ratingTextClass}>{movie.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <p className={subtitleClass}>{movie.year} • {movie.director}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres.map((g: string, i: number) => (
                                    <span key={i} className={genreClass}>
                                        {g}
                                    </span>
                                ))}
                            </div>

                            <h3 className={overviewTitleClass}>Overview</h3>
                            <p className={overviewTextClass}>{movie.overview}</p>
                        </div>

                        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t ${borderClass}`}>
                            <div>
                                <div className={labelClass}>
                                    <Clock size={16} className="mr-1" />
                                    <span className="text-sm">Runtime</span>
                                </div>
                                <p className={valueClass}>{movie.duration} min</p>
                            </div>
                            <div>
                                <div className={labelClass}>
                                    <DollarSign size={16} className="mr-1" />
                                    <span className="text-sm">Budget</span>
                                </div>
                                <p className={valueClass}>{movie.budget}</p>
                            </div>
                            <div>
                                <div className={labelClass}>
                                    <TrendingUp size={16} className="mr-1" />
                                    <span className="text-sm">Revenue</span>
                                </div>
                                <p className={valueClass}>{movie.boxOffice}</p>
                            </div>
                            <div>
                                <div className={labelClass}>
                                    <Users size={16} className="mr-1" />
                                    <span className="text-sm">Cast</span>
                                </div>
                                <p className={`${valueClass} text-sm truncate`}>{movie.cast.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;

import React, { useEffect, useState } from 'react';
import { Newspaper, Film, Users, RefreshCw, TrendingUp } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { fetchActorsNews, fetchMoviesNews, NewsArticle } from '../services/api';

interface NewsPageProps {
    theme?: 'light' | 'dark';
}

const NewsPage: React.FC<NewsPageProps> = ({ theme = 'light' }) => {
    const [actorsNews, setActorsNews] = useState<NewsArticle[]>([]);
    const [moviesNews, setMoviesNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'actors' | 'movies'>('actors');

    const isDark = theme === 'dark';

    const loadNews = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const [actors, movies] = await Promise.all([
                fetchActorsNews(30),
                fetchMoviesNews(30)
            ]);
            setActorsNews(actors);
            setMoviesNews(movies);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleRefresh = () => {
        loadNews(true);
    };

    // Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
                    <div className={`h-48 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className="p-5 space-y-3">
                        <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`} />
                        <div className={`h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-full`} />
                        <div className={`h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-2/3`} />
                    </div>
                </div>
            ))}
        </div>
    );

    const currentNews = activeTab === 'actors' ? actorsNews : moviesNews;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className={`
            relative rounded-3xl overflow-hidden p-8 md:p-12 border
            ${isDark ? 'border-gray-700/50 shadow-2xl shadow-blue-900/20' : 'border-gray-100 shadow-xl'}
        `}>
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: 'url("/news-bg.jpg")' }}
                />
                {/* Dynamic Overlay based on Theme */}
                <div className={`
                absolute inset-0 
                ${isDark
                        ? 'bg-gradient-to-r from-gray-900 via-gray-900/80 to-blue-900/40 opacity-90'
                        : 'bg-gradient-to-r from-white via-white/80 to-blue-50/40 opacity-85'
                    }
            `} />

                {/* Background Pattern / Accents */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl backdrop-blur-md ${isDark ? 'bg-blue-500/20 border border-blue-400/20' : 'bg-blue-100/50 border border-blue-200/50'}`}>
                            <Newspaper className={isDark ? 'text-blue-400' : 'text-blue-600'} size={28} />
                        </div>
                        <div>
                            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
                                Cinema News
                            </h1>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Stay updated with the latest from Hollywood
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-sm ${isDark ? 'bg-black/20' : 'bg-white/40'}`}>
                            <TrendingUp size={14} className={isDark ? 'text-green-400' : 'text-green-600'} />
                            <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {actorsNews.length + moviesNews.length} articles • Updated just now
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className={`
          inline-flex p-1.5 rounded-2xl
          ${isDark ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-gray-100/80 border border-gray-200'}
        `}>
                    <button
                        onClick={() => setActiveTab('actors')}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${activeTab === 'actors'
                                ? isDark
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-white text-blue-700 shadow-md'
                                : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }
            `}
                    >
                        <Users size={18} />
                        Actors News
                        <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${activeTab === 'actors'
                                ? isDark ? 'bg-blue-500/30' : 'bg-blue-100'
                                : isDark ? 'bg-gray-700' : 'bg-gray-200'
                            }
            `}>
                            {actorsNews.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('movies')}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${activeTab === 'movies'
                                ? isDark
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white text-purple-700 shadow-md'
                                : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }
            `}
                    >
                        <Film size={18} />
                        Movies News
                        <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${activeTab === 'movies'
                                ? isDark ? 'bg-purple-500/30' : 'bg-purple-100'
                                : isDark ? 'bg-gray-700' : 'bg-gray-200'
                            }
            `}>
                            {moviesNews.length}
                        </span>
                    </button>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300
            ${isDark
                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm'
                        }
            ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* News Grid */}
            {loading ? (
                <LoadingSkeleton />
            ) : currentNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentNews.map((article) => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            theme={theme}
                        />
                    ))}
                </div>
            ) : (
                <div className={`
          text-center py-16 rounded-2xl
          ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}
        `}>
                    <Newspaper size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        No News Available
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Try refreshing the page to load the latest news.
                    </p>
                    <button
                        onClick={handleRefresh}
                        className={`
              mt-4 px-6 py-2 rounded-lg font-medium transition-colors
              ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
                    >
                        Refresh Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsPage;

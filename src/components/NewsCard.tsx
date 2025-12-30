import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../services/api';

interface NewsCardProps {
    article: NewsArticle;
    theme?: 'light' | 'dark';
    compact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, theme = 'light', compact = false }) => {
    const isDark = theme === 'dark';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleClick = () => {
        window.open(article.url, '_blank', 'noopener,noreferrer');
    };

    if (compact) {
        return (
            <div
                onClick={handleClick}
                className={`
          group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300
          ${isDark
                        ? 'bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-blue-500/30'
                        : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md'
                    }
        `}
            >
                {/* Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    {article.urlToImage ? (
                        <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <span className={`text-2xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📰</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className={`font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {article.title}
                        </h3>
                        <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {article.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(article.publishedAt)}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            • {article.source.name}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={`
        group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl
        ${isDark
                    ? 'bg-gray-800 border border-gray-700/50 hover:border-blue-500/50 shadow-lg shadow-black/20'
                    : 'bg-white border border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl'
                }
      `}
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                {article.urlToImage ? (
                    <>
                        <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-gray-900 via-gray-900/50' : 'from-black/60 via-transparent'} to-transparent`} />
                    </>
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className="text-4xl">📰</span>
                    </div>
                )}

                {/* Source Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`
            px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md
            ${isDark
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            : 'bg-white/90 text-blue-700 border border-blue-100'
                        }
          `}>
                        {article.source.name}
                    </span>
                </div>

                {/* External Link Icon */}
                <div className={`
          absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0
          ${isDark ? 'bg-white/10 backdrop-blur-md' : 'bg-black/10 backdrop-blur-md'}
        `}>
                    <ExternalLink size={14} className={isDark ? 'text-white' : 'text-white'} />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {article.title}
                </h3>
                <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {article.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(article.publishedAt)}
                        </span>
                    </div>
                    {article.author && (
                        <span className={`text-xs truncate max-w-[120px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            by {article.author}
                        </span>
                    )}
                </div>
            </div>

            {/* Animated Border Glow Effect for Dark Mode */}
            {isDark && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(139, 92, 246, 0.1) 100%)',
                    }}
                />
            )}
        </div>
    );
};

export default NewsCard;

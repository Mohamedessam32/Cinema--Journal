import React, { useEffect, useState } from 'react';
import { Play, Newspaper, Zap } from 'lucide-react';
import FilmCard from '../components/FilmCard';
import NewsCard from '../components/NewsCard';
import { fetchMovies, fetchBreakingNews, NewsArticle } from '../services/api';

interface HomePageProps {
  onSeeAllPopular?: () => void;
  onMovieSelect?: (id: number) => void;
  onExploreMovies?: () => void;
  onNavigate?: (page: string) => void;
  theme?: 'light' | 'dark';
}

const HomePage: React.FC<HomePageProps> = ({ onMovieSelect, onExploreMovies, onNavigate, theme = 'light' }) => {
  const [latestMovies, setLatestMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [famousMovies, setFamousMovies] = useState<any[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // Glow classes logic based on theme
  const isDark = theme === 'dark';
  // FIXED: Light mode now uses white bg and dark text
  const sectionClass = isDark
    ? "relative bg-blue-900 text-white rounded-2xl overflow-hidden shadow-xl glow-box"
    : "relative bg-white text-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100";

  const titleGlow = isDark ? "glow-text" : "";
  const buttonGlow = isDark
    ? "glow-box shadow-[0_0_15px_rgba(255,255,255,0.5)]"
    : "shadow-md border border-gray-200 hover:bg-gray-50 text-blue-700";

  const seeMoreClass = isDark
    ? "text-blue-400 font-medium hover:text-blue-300 text-sm glow-text"
    : "text-blue-600 font-medium hover:text-blue-800 text-sm";

  const sectionTitleClass = isDark
    ? "text-2xl font-bold glow-text text-white"
    : "text-2xl font-bold text-gray-900";

  const subTextClass = isDark ? "text-xl mb-8 text-blue-100" : "text-xl mb-8 text-gray-700";

  useEffect(() => {
    const loadMovies = async () => {
      // 1. Latest Movies (now_playing) - with director info
      const latest = await fetchMovies('now_playing', 5, 1, true);
      setLatestMovies(latest);

      // 2. Top Rated Movies - with director info
      const topRated = await fetchMovies('top_rated', 5, 1, true);
      setTopRatedMovies(topRated);

      // 3. Most Famous Movies (famous) - with director info
      const famous = await fetchMovies('famous', 5, 1, true);
      setFamousMovies(famous);
    };
    loadMovies();
  }, []);

  // Load breaking news
  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      try {
        const news = await fetchBreakingNews(4);
        setBreakingNews(news);
      } catch (error) {
        console.error('Error loading breaking news:', error);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  // News loading skeleton
  const NewsLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
          <div className={`h-40 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="p-4 space-y-2">
            <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`} />
            <div className={`h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-full`} />
            <div className={`h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} w-1/2`} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <section className={sectionClass}>
        <div className="relative z-10 p-12 md:w-2/3">
          <h1 className={`text-4xl font-black mb-4 uppercase tracking-tighter ${titleGlow}`}>
            Cinema <span className="text-blue-500">Journal</span>
          </h1>
          <p className={subTextClass}>
            Your daily destination for breaking cinema news and movie discovery.
          </p>
          <button
            onClick={onExploreMovies}
            className={`bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center ${buttonGlow}`}
          >
            <Play className="mr-2" size={20} />
            Explore Movies
          </button>
        </div>
        <div
          className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("/home-bg.jpg")' }}
        ></div>
      </section>

      {/* Breaking News Section */}
      <section className={`
        relative rounded-3xl overflow-hidden p-8 border transition-all duration-500
        ${isDark ? 'border-gray-700/50 bg-gray-900/40 shadow-2xl shadow-blue-900/10' : 'border-gray-100 bg-white shadow-lg'}
      `}>
        {/* Wallpaper Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-20"
          style={{ backgroundImage: 'url("/news-bg.jpg")' }}
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-900/60 to-transparent' : 'bg-gradient-to-br from-white via-white/40 to-transparent'}`} />

        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl backdrop-blur-md ${isDark ? 'bg-red-500/20 border border-red-500/20' : 'bg-red-100 border border-red-200'}`}>
              <Zap className={`${isDark ? 'text-red-400' : 'text-red-600'}`} size={20} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Breaking News</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Latest updates from Hollywood
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('news')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-md ${isDark
              ? 'bg-gray-800/80 hover:bg-gray-700 text-blue-400 border border-gray-700 hover:border-blue-500/50'
              : 'bg-blue-50/80 hover:bg-blue-100 text-blue-600 border border-blue-100'
              }`}
          >
            <Newspaper size={16} />
            <span className="font-medium text-sm">See All</span>
          </button>
        </div>

        <div className="relative z-10">
          {newsLoading ? (
            <NewsLoadingSkeleton />
          ) : breakingNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {breakingNews.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <div className={`
              text-center py-12 rounded-2xl
              ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-50 border border-gray-100'}
            `}>
              <Newspaper size={40} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Unable to load news at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Movies Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={sectionTitleClass}>Latest Movies</h2>
          <button
            onClick={() => onNavigate?.('latestMovies')}
            className={seeMoreClass}
          >
            See More
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {latestMovies.map((film, index) => (
            <FilmCard
              key={index}
              {...film}
              theme={theme}
              onClick={() => onMovieSelect?.(film.id)}
            />
          ))}
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={sectionTitleClass}>Top Rated Movies</h2>
          <button
            onClick={() => onNavigate?.('topRated')}
            className={seeMoreClass}
          >
            See More
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topRatedMovies.map((film, index) => (
            <FilmCard
              key={index}
              {...film}
              theme={theme}
              onClick={() => onMovieSelect?.(film.id)}
            />
          ))}
        </div>
      </section>

      {/* Most Famous Movies Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={sectionTitleClass}>Most Famous Movies</h2>
          <button
            onClick={() => onNavigate?.('famousMovies')}
            className={seeMoreClass}
          >
            See More
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {famousMovies.map((film, index) => (
            <FilmCard
              key={index}
              {...film}
              theme={theme}
              onClick={() => onMovieSelect?.(film.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
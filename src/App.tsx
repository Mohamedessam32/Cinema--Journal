import { useState } from 'react';
import { Film, BarChart4, Users, Clapperboard, Video, Star, User, Newspaper } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FilmAnaliz from './pages/FilmAnaliz';
import TrendAnaliz from './pages/TrendAnaliz';
import YonetmenAnaliz from './pages/YonetmenAnaliz';
import FilmKarsilastirma from './pages/FilmKarsilastirma';
import FilmOneriler from './pages/FilmOneriler';
import MoviesList from './pages/MoviesList';
import MovieDetail from './pages/MovieDetail';
import PersonProfile from './pages/PersonProfile';
import NewsPage from './pages/NewsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const [isDirectorProfile, setIsDirectorProfile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Initial static menu items
  const menuItems = [
    { id: 'home', label: 'Home', icon: <Film size={20} /> },
    { id: 'news', label: 'News', icon: <Newspaper size={20} /> },
    { id: 'movies', label: 'Movies', icon: <Video size={20} /> },
    { id: 'topRated', label: 'Top Rated Movies', icon: <Star size={20} /> },
    { id: 'famousActors', label: 'Famous Actors', icon: <Users size={20} /> },
    { id: 'famousDirectors', label: 'Famous Directors', icon: <User size={20} /> },
    { id: 'filmKarsilastirma', label: 'Comparison', icon: <BarChart4 size={20} /> },
    { id: 'filmOneriler', label: 'Recommendations', icon: <Clapperboard size={20} /> },
  ];

  const handleMovieSelect = (id: number) => {
    setSelectedMovieId(id);
    setCurrentPage('movieDetail');
  };

  const handleActorProfile = (personId: number, isDirector: boolean = false) => {
    setSelectedActorId(personId);
    setIsDirectorProfile(isDirector);
    setCurrentPage('actorProfile');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage
          onSeeAllPopular={() => setCurrentPage('popularMovies')}
          onMovieSelect={handleMovieSelect}
          onExploreMovies={() => setCurrentPage('movies')}
          onNavigate={setCurrentPage}
          theme={theme}
        />;
      case 'news':
        return <NewsPage theme={theme} />;
      case 'movies':
        return <MoviesList onBack={() => setCurrentPage('home')} title="Explore Movies" filterMode={true} onMovieSelect={handleMovieSelect} theme={theme} />;
      case 'latestMovies':
        return <MoviesList onBack={() => setCurrentPage('home')} type="now_playing" title="Latest Movies" onMovieSelect={handleMovieSelect} theme={theme} />;
      case 'famousMovies':
        return <MoviesList onBack={() => setCurrentPage('home')} type="famous" title="Most Famous Movies" onMovieSelect={handleMovieSelect} theme={theme} />;
      case 'topRated':
        return <MoviesList onBack={() => setCurrentPage('home')} type="top_rated" title="Top Rated Movies" onMovieSelect={handleMovieSelect} theme={theme} />;
      case 'famousActors':
        return <YonetmenAnaliz type="actors" hideAnalysis={true} theme={theme} onViewProfile={handleActorProfile} />;
      case 'famousDirectors':
        return <YonetmenAnaliz type="directors" hideAnalysis={true} theme={theme} onViewProfile={handleActorProfile} />;
      case 'actorProfile':
        return selectedActorId
          ? <PersonProfile
            personId={selectedActorId}
            isDirector={isDirectorProfile}
            onBack={() => setCurrentPage(isDirectorProfile ? 'famousDirectors' : 'famousActors')}
            onMovieSelect={handleMovieSelect}
            theme={theme}
          />
          : <HomePage theme={theme} />;
      case 'movieDetail':
        return selectedMovieId ? <MovieDetail movieId={selectedMovieId} onBack={() => setCurrentPage('home')} theme={theme} /> : <HomePage theme={theme} />;
      case 'popularMovies':
        return <MoviesList onBack={() => setCurrentPage('home')} type="popular" title="Crowd Pleaser Movies" onMovieSelect={handleMovieSelect} theme={theme} />;
      case 'filmAnaliz':
        return <FilmAnaliz onSeeAllTopRated={() => setCurrentPage('topRated')} />;
      case 'trendAnaliz':
        return <TrendAnaliz />;
      case 'yonetmenAnaliz':
        return <YonetmenAnaliz type="both" hideAnalysis={false} theme={theme} onViewProfile={handleActorProfile} />;
      case 'filmKarsilastirma':
        return <FilmKarsilastirma theme={theme} />;
      case 'filmOneriler':
        return <FilmOneriler theme={theme} onMovieSelect={handleMovieSelect} />;
      default:
        return <HomePage theme={theme} />;
    }
  };

  const isHome = currentPage === 'home';
  // If dark mode: Home gets special glow bg (#0f172a), others get standard dark bg (gray-900)
  // If light mode: gray-50
  const bgClass = theme === 'dark'
    ? (isHome ? 'bg-[#0f172a] text-white' : 'bg-gray-900 text-white')
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass} transition-colors duration-300`}>
      <Navbar
        menuItems={menuItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className={`flex-grow container mx-auto px-4 py-8 ${(isHome && theme === 'dark') ? 'glow-theme-wrapper' : ''}`}>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
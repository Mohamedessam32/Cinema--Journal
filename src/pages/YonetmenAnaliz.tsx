import React, { useEffect, useState } from 'react';
import { Users, User, Award, Search } from 'lucide-react';
import { fetchPeople, searchPeople } from '../services/api';

interface YonetmenAnalizProps {
  type?: 'directors' | 'actors' | 'both';
  hideAnalysis?: boolean;
  theme?: 'light' | 'dark';
  onViewProfile?: (personId: number, isDirector?: boolean) => void;
}

const YonetmenAnaliz: React.FC<YonetmenAnalizProps> = ({ type = 'both', hideAnalysis = false, theme = 'light', onViewProfile }) => {
  const getInitialTab = () => {
    if (type === 'actors') return 'oyuncular';
    return 'yonetmenler';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [data, setData] = useState<{ directors: any[]; actors: any[] }>({ directors: [], actors: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [type]);

  useEffect(() => {
    const loadPeople = async () => {
      const result = await fetchPeople();
      setData(result);
    };
    loadPeople();
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchPeople(searchQuery);
    // Filter by current tab type
    const filtered = results.filter((p: any) =>
      activeTab === 'oyuncular'
        ? p.department === 'Acting'
        : p.department === 'Directing'
    );
    setSearchResults(filtered.length > 0 ? filtered : results); // Show all if no specific match
    setIsSearching(false);
  };

  // Clear search when tab changes
  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, [activeTab]);

  const { directors: topDirectors, actors: topActors } = data;
  const baseData = activeTab === 'yonetmenler' ? topDirectors : topActors;
  const currentData = searchResults.length > 0 ? searchResults : baseData;

  const getTitle = () => {
    if (type === 'directors') return 'Famous Directors';
    if (type === 'actors') return 'Famous Actors';
    return 'Director & Cast Analysis';
  };

  // Theme classes
  const cardClass = isDark
    ? "bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    : "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300";
  const titleClass = isDark ? "text-2xl font-bold mb-4 text-white" : "text-2xl font-bold mb-4 text-gray-900";
  const nameClass = isDark ? "text-lg font-semibold mb-1 truncate text-white" : "text-lg font-semibold mb-1 truncate text-gray-900";
  const subTextClass = isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm";
  const searchBarClass = isDark
    ? "bg-gray-800 p-4 rounded-lg shadow-md"
    : "bg-white p-4 rounded-lg shadow-md";
  const inputClass = isDark
    ? "w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    : "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const tabBgClass = isDark ? "bg-gray-800 rounded-lg shadow-md overflow-hidden" : "bg-white rounded-lg shadow-md overflow-hidden";
  const tabActiveClass = isDark ? "bg-blue-900 text-blue-300 border-b-2 border-blue-500" : "bg-blue-50 text-blue-600 border-b-2 border-blue-600";
  const tabInactiveClass = isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-blue-900 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">{getTitle()}</h1>
        <p className="text-blue-100">
          {hideAnalysis
            ? `List of top ${activeTab === 'yonetmenler' ? 'directors' : 'actors'}.`
            : "Discover famous directors and actors in the movie world."
          }
        </p>
      </div>

      {/* Tabs - Only show if type is 'both' */}
      {type === 'both' && (
        <div className={tabBgClass}>
          <div className={`flex ${isDark ? 'border-b border-gray-700' : 'border-b'}`}>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'yonetmenler' ? tabActiveClass : tabInactiveClass}`}
              onClick={() => setActiveTab('yonetmenler')}
            >
              <div className="flex items-center justify-center space-x-2">
                <User size={20} />
                <span>Directors</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'oyuncular' ? tabActiveClass : tabInactiveClass}`}
              onClick={() => setActiveTab('oyuncular')}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users size={20} />
                <span>Actors</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className={searchBarClass}>
        <div className="flex gap-2">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder={activeTab === 'yonetmenler' ? 'Search director...' : 'Search actor...'}
              className={inputClass}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Search size={18} className="mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results heading */}
      {searchResults.length > 0 && (
        <p className={subTextClass}>Showing {searchResults.length} results for "{searchQuery}"</p>
      )}

      {/* Top Directors/Actors List */}
      <div>
        <h2 className={titleClass}>
          {activeTab === 'yonetmenler' ? 'Top Directors' : 'Top Actors'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentData.map((person, index) => (
            <div key={`${person.id}-${index}`} className={cardClass}>
              <div className="h-64 overflow-hidden relative group">
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-bold">{person.name}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className={nameClass}>{person.name}</h3>
                <div className="flex items-center mb-2">
                  <Award className="text-yellow-500 mr-1" size={18} />
                  <span className={isDark ? "font-medium text-white" : "font-medium"}>{person.avgRating.toFixed(1)}</span>
                  <span className={`${subTextClass} ml-1`}>rating</span>
                </div>
                <p className={subTextClass}>
                  <span className="font-medium">{person.filmCount}</span> credited works
                </p>
                <p className={`${subTextClass} truncate`} title={person.bestFilm}>
                  Known for: <span className="font-medium">{person.bestFilm}</span>
                </p>
                <button
                  onClick={() => onViewProfile?.(person.id, activeTab === 'yonetmenler')}
                  className="mt-3 text-blue-500 hover:text-blue-400 text-sm font-medium w-full text-left"
                >
                  View Profile →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YonetmenAnaliz;

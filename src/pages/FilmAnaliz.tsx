import React, { useEffect, useState } from 'react';
import ChartCard from '../components/ChartCard';
import FilmCard from '../components/FilmCard';
import { BarChart4, TrendingUp, Award } from 'lucide-react';
import { fetchMovies } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FilmAnalizProps {
  onSeeAllTopRated?: () => void;
}

const FilmAnaliz: React.FC<FilmAnalizProps> = ({ onSeeAllTopRated }) => {
  const [topRatedFilms, setTopRatedFilms] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [genreData, setGenreData] = useState<any[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      // Fetching 20 movies for better chart data
      const movies = await fetchMovies('top_rated', 20);
      setTopRatedFilms(movies.slice(0, 8)); // Show only 8 in the grid

      // Prepare Chart Data: Ratings by Year
      const yearStats: Record<string, { total: number; count: number }> = {};
      movies.forEach((m: any) => {
        if (!yearStats[m.year]) yearStats[m.year] = { total: 0, count: 0 };
        yearStats[m.year].total += m.rating;
        yearStats[m.year].count += 1;
      });

      const ratingByYear = Object.keys(yearStats).map(year => ({
        year,
        rating: parseFloat((yearStats[year].total / yearStats[year].count).toFixed(1))
      })).sort((a, b) => parseInt(a.year) - parseInt(b.year)).slice(-10); // Last 10 years present
      setChartData(ratingByYear);

      // Prepare Genre Data (Mocking genre names as we define IDs usually)
      // For simplicity in this demo, I'll map a few common IDs or just count IDs
      const genreCounts: Record<string, number> = {};
      movies.forEach((m: any) => {
        if (m.genres && m.genres.length > 0) {
          // taking primary genre
          const g = m.genres[0];
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        }
      });
      const genres = Object.keys(genreCounts).map(g => ({
        name: `Genre ${g}`, // In real app, map ID to Name
        value: genreCounts[g]
      }));
      setGenreData(genres);
    };
    loadMovies();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Movie Analysis</h1>
          <p className="text-blue-100 max-w-xl">
            Statistical insights and performance metrics across our global cinema database.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* Filters (kept static for now as requested we focus on charts/list) */}
      <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ... filters ... */}
          {/* Keeping filters UI but they are not functional with backend in this step yet */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Year Range</label>
            <div className="flex items-center space-x-2">
              <input type="number" placeholder="1900" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              <span className="text-gray-500">-</span>
              <input type="number" placeholder="2025" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Movie Genre</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="">All Genres</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Minimum Rating</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="0">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Average Ratings by Year">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#666" />
                <YAxis domain={[0, 10]} stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff' }} />
                <Bar dataKey="rating" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Distribution of Movie Genres">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-full">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Highest Rating</p>
              <p className="text-2xl font-black text-white">9.3</p>
              <p className="text-sm text-gray-500 truncate">The Shawshank Redemption</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-full">
              <BarChart4 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Average Rating</p>
              <p className="text-2xl font-black text-white">7.2</p>
              <p className="text-sm text-gray-500">Global Average</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Most Popular Genre</p>
              <p className="text-2xl font-bold">Drama</p>
              <p className="text-sm text-gray-500">Total 12,453 movies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rated Films */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Highest Rated Movies</h2>
          <button onClick={onSeeAllTopRated} className="text-blue-600 font-medium hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRatedFilms.map((film, index) => (
            <FilmCard key={index} {...film} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmAnaliz;
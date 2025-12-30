import React, { useEffect, useState } from 'react';
import ChartCard from '../components/ChartCard';
import { TrendingUp } from 'lucide-react';
import { fetchTrends } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TrendAnaliz: React.FC = () => {
  const [trends, setTrends] = useState<any>(null);

  useEffect(() => {
    const loadTrends = async () => {
      const data = await fetchTrends();
      setTrends(data);
    };
    loadTrends();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-blue-900 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Trend Analysis</h1>
        <p className="text-blue-100">
          Discover current trends and changes in the movie world.
        </p>
      </div>

      {/* Stats and other sections remain similar but dynamically fed */}

      {/* Trend Stats */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rising Genre</p>
                <p className="text-2xl font-bold">{trends.risingGenres?.[0]?.name || 'Sci-Fi'}</p>
                <p className="text-sm text-blue-600">%{trends.risingGenres?.[0]?.increase || 32} increase</p>
              </div>
            </div>
          </div>
          {/* ... other stats ... */}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Weekly Movie Popularity">
          <div className="h-80 w-full">
            {trends?.chartData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="popularity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Rising Genres Impact">
          <div className="h-64 w-full">
            {trends?.risingGenres && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends.risingGenres}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="increase" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
        {/* Placeholder for second chart or reuse same data logic */}
      </div>

      {/* Trend Topics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Trending Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trends?.popularTopics?.map((topic: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{topic.title}</h3>
              <p className="text-gray-600 mb-4">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendAnaliz;
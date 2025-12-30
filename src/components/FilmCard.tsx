import React from 'react';
import { Star } from 'lucide-react';

interface FilmCardProps {
  id?: number;
  title: string;
  year: string;
  director: string;
  rating: number;
  imageUrl: string;
  genres: string[];
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

const FilmCard: React.FC<FilmCardProps> = ({
  title,
  year,
  director,
  rating,
  imageUrl,
  genres,
  onClick,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  return (
    <div
      className={`${isDark ? 'bg-gray-800 text-gray-100 hover:shadow-blue-500/30' : 'bg-white text-gray-900'} rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="h-64 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className={`text-lg font-semibold mb-1 line-clamp-1 ${isDark ? 'text-white' : ''}`} title={title}>{title}</h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>{year} • {director}</p>
        <div className="flex items-center mb-2">
          <Star className="text-yellow-500 mr-1" size={18} />
          <span className="font-bold">{rating.toFixed(1)}</span>
          <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm ml-1`}>/10</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {genres.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full border ${isDark ? 'bg-gray-700 text-blue-300 border-gray-600' : 'bg-blue-50 text-blue-700 border-blue-100'}`}
            >
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className={`px-2 py-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>+ {genres.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
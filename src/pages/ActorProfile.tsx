import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Film, Star } from 'lucide-react';
import { getPersonDetails } from '../services/api';
import FilmCard from '../components/FilmCard';

interface ActorProfileProps {
    personId: number;
    onBack: () => void;
    onMovieSelect?: (id: number) => void;
    theme?: 'light' | 'dark';
}

const ActorProfile: React.FC<ActorProfileProps> = ({ personId, onBack, onMovieSelect, theme = 'light' }) => {
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadPerson = async () => {
            setLoading(true);
            const data = await getPersonDetails(personId);
            setPerson(data);
            setLoading(false);
        };
        loadPerson();
    }, [personId]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!person) {
        return (
            <div className="text-center py-12">
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>Person not found.</p>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const cardClass = isDark
        ? "bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        : "bg-white rounded-xl shadow-lg overflow-hidden";

    const textClass = isDark ? "text-white" : "text-gray-900";
    const subTextClass = isDark ? "text-gray-300" : "text-gray-600";
    const backButtonClass = isDark
        ? "p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
        : "p-2 hover:bg-gray-200 rounded-full transition-colors";

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header with Back Button */}
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className={backButtonClass}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className={`text-3xl font-bold ${textClass}`}>{person.name}</h1>
            </div>

            {/* Profile Card */}
            <div className={cardClass}>
                <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3">
                        <img
                            src={person.imageUrl}
                            alt={person.name}
                            className="w-full h-80 md:h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="md:w-2/3 p-6">
                        <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>{person.name}</h2>

                        <div className="flex flex-wrap gap-4 mb-4">
                            {person.birthday && (
                                <div className={`flex items-center ${subTextClass}`}>
                                    <Calendar size={18} className="mr-2" />
                                    <span>{person.birthday}</span>
                                </div>
                            )}
                            {person.placeOfBirth && (
                                <div className={`flex items-center ${subTextClass}`}>
                                    <MapPin size={18} className="mr-2" />
                                    <span>{person.placeOfBirth}</span>
                                </div>
                            )}
                            <div className={`flex items-center ${subTextClass}`}>
                                <Film size={18} className="mr-2" />
                                <span>{person.totalMovies} Movies</span>
                            </div>
                        </div>

                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                            {person.knownFor}
                        </div>

                        <p className={`${subTextClass} leading-relaxed line-clamp-6`}>
                            {person.biography}
                        </p>
                    </div>
                </div>
            </div>

            {/* Famous Movies Section */}
            <div>
                <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>
                    <Star className="inline mr-2 text-yellow-500" size={24} />
                    Famous Movies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {person.movies.map((movie: any, index: number) => (
                        <FilmCard
                            key={`${movie.id}-${index}`}
                            id={movie.id}
                            title={movie.title}
                            year={movie.year}
                            rating={movie.rating}
                            imageUrl={movie.imageUrl}
                            director={movie.character || 'Unknown'}
                            genres={movie.genres || []}
                            theme={theme}
                            onClick={() => onMovieSelect?.(movie.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActorProfile;

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Film, Star } from 'lucide-react';
import { getPersonDetails, getDirectorDetails } from '../services/api';
import FilmCard from '../components/FilmCard';

interface PersonProfileProps {
    personId: number;
    onBack: () => void;
    onMovieSelect?: (id: number) => void;
    theme?: 'light' | 'dark';
    isDirector?: boolean;
}

const PersonProfile: React.FC<PersonProfileProps> = ({ personId, onBack, onMovieSelect, theme = 'light', isDirector = false }) => {
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadPerson = async () => {
            setLoading(true);
            // Try fetching as director first if flag is set, otherwise use person details
            const data = isDirector
                ? await getDirectorDetails(personId)
                : await getPersonDetails(personId);

            // If director details failed or returned no movies, try regular person details as fallback
            if (isDirector && (!data || data.movies.length === 0)) {
                const fallback = await getPersonDetails(personId);
                if (fallback) setPerson(fallback);
                else setPerson(data);
            } else {
                setPerson(data);
            }

            setLoading(false);
        };
        loadPerson();
    }, [personId, isDirector]);

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
                            className="w-full h-80 md:h-full object-cover shadow-2xl"
                        />
                    </div>

                    {/* Info */}
                    <div className="md:w-2/3 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className={`text-3xl font-bold ${textClass}`}>{person.name}</h2>
                                <p className={`text-blue-500 font-semibold mt-1`}>
                                    {isDirector ? 'Film Director' : (person.knownFor || 'Actor')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 py-4 border-y border-gray-700/50">
                            {person.birthday && (
                                <div className={`flex flex-col`}>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Born</span>
                                    <div className={`flex items-center ${textClass} font-medium mt-1`}>
                                        <Calendar size={16} className="mr-2 text-blue-500" />
                                        <span>{person.birthday}</span>
                                    </div>
                                </div>
                            )}
                            {person.placeOfBirth && (
                                <div className={`flex flex-col`}>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Birthplace</span>
                                    <div className={`flex items-center ${textClass} font-medium mt-1`}>
                                        <MapPin size={16} className="mr-2 text-blue-500" />
                                        <span className="truncate max-w-[250px]">{person.placeOfBirth}</span>
                                    </div>
                                </div>
                            )}
                            <div className={`flex flex-col`}>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Filmography</span>
                                <div className={`flex items-center ${textClass} font-medium mt-1`}>
                                    <Film size={16} className="mr-2 text-blue-500" />
                                    <span>{person.totalMovies} Movies in Credits</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className={`text-lg font-bold ${textClass}`}>Biography</h3>
                            <p className={`${subTextClass} leading-relaxed line-clamp-6 text-sm italic`}>
                                {person.biography}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Famous Movies Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${textClass}`}>
                        <Star className="inline mr-2 text-yellow-500 animate-pulse" size={24} />
                        Best {isDirector ? 'Directed' : 'Performed'} Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {person.movies.map((movie: any, index: number) => (
                        <FilmCard
                            key={`${movie.id}-${index}`}
                            id={movie.id}
                            title={movie.title}
                            year={movie.year}
                            rating={movie.rating}
                            imageUrl={movie.imageUrl}
                            director={isDirector ? person.name : (movie.character || 'Unknown')}
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

export default PersonProfile;

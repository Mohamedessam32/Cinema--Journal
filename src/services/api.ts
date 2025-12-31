export const API_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTZiYmIwYmNhZGVjZjAyZDQ2NmZhN2I1YjM3YTFiNiIsIm5iZiI6MTc2Njc1OTExNS4wNSwic3ViIjoiNjk0ZTlhY2IxY2RiM2Y0OTZmMDcyZGM5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.OlMKjCI0ekYi7Ib8dNtmP6vjHBwPHvGhX-o6g5OUqzk';

const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
};

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let genreMap: Record<number, string> = {};

export const fetchGenres = async () => {
    if (Object.keys(genreMap).length > 0) return genreMap;
    try {
        const response = await fetch(`${API_URL}/genre/movie/list`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        data.genres.forEach((g: any) => {
            genreMap[g.id] = g.name;
        });
        return genreMap;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return {};
    }
};

// Helper to map movie results
const mapMovie = (movie: any, director?: string) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    rating: movie.vote_average,
    imageUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    director: director || 'Unknown',
    genres: movie.genre_ids ? movie.genre_ids.map((id: number) => genreMap[id] || 'Unknown') : [],
    overview: movie.overview,
    vote_count: movie.vote_count
});

// Helper to fetch director for a single movie
const fetchDirectorForMovie = async (movieId: number): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/movie/${movieId}/credits`, { headers });
        if (!response.ok) return 'Unknown';
        const data = await response.json();
        const director = data.crew?.find((c: any) => c.job === 'Director');
        return director?.name || 'Unknown';
    } catch {
        return 'Unknown';
    }
};

export const fetchMovies = async (type: 'popular' | 'top_rated' | 'now_playing' | 'famous' = 'popular', limit?: number, pageNum: number = 1, includeDirector: boolean = false) => {
    try {
        await fetchGenres(); // Ensure genres are loaded

        let response;
        if (type === 'famous') {
            const tenYearsAgo = new Date();
            tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 12);
            const dateStr = tenYearsAgo.toISOString().split('T')[0];
            response = await fetch(`${API_URL}/discover/movie?sort_by=vote_count.desc&primary_release_date.gte=${dateStr}&vote_average.gte=7.0&page=${pageNum}`, { headers });
        } else {
            response = await fetch(`${API_URL}/movie/${type}?page=${pageNum}`, { headers });
        }

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        let movies = limit ? data.results.slice(0, limit) : data.results;

        // If we want directors and list is small enough (performance optimization)
        if (includeDirector && movies.length <= 20) {
            const directorPromises = movies.map((m: any) => fetchDirectorForMovie(m.id));
            const directors = await Promise.all(directorPromises);
            return movies.map((movie: any, index: number) => mapMovie(movie, directors[index]));
        }

        return movies.map((movie: any) => mapMovie(movie));
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};


export const fetchMoviesByGenre = async (genreId: number, pageNum: number = 1) => {
    try {
        await fetchGenres();
        const response = await fetch(`${API_URL}/discover/movie?with_genres=${genreId}&page=${pageNum}&sort_by=popularity.desc`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.map(mapMovie);
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return [];
    }
};


export const fetchTrends = async () => {
    try {
        const response = await fetch(`${API_URL}/trending/movie/week`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Transform for trend analysis
        const movies = data.results.map((m: any) => ({ name: m.title.substring(0, 10), popularity: m.popularity }));

        // Mocking some internal calculations since TMDB doesn't give "rising genres" directly
        const risingGenres = [
            { name: 'Sci-Fi', increase: 45 },
            { name: 'Action', increase: 30 },
            { name: 'Drama', increase: 15 },
        ];

        return {
            chartData: movies.slice(0, 10),
            risingGenres,
            popularTopics: [
                { title: 'Summer Blockbusters', description: 'Action movies are dominating the box office this season.' },
                { title: 'Indie Revival', description: 'Independent films are gaining more traction on streaming platforms.' }
            ]
        };
    } catch (error) {
        console.error('Error fetching trends:', error);
        return null;
    }
};

export const searchMovies = async (query: string) => {
    try {
        const response = await fetch(`${API_URL}/search/movie?query=${encodeURIComponent(query)}`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.map(mapMovie);
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

export const getMovieDetails = async (id: number) => {
    try {
        const response = await fetch(`${API_URL}/movie/${id}?append_to_response=credits`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const movie = await response.json();

        const director = movie.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'Unknown';
        const cast = movie.credits?.cast?.slice(0, 3).map((c: any) => c.name) || [];

        return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            director: director,
            rating: movie.vote_average,
            duration: movie.runtime,
            genres: movie.genres.map((g: any) => g.name),
            cast: cast,
            budget: movie.budget ? `$${(movie.budget / 1000000).toFixed(1)} million` : 'N/A',
            boxOffice: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)} million` : 'N/A',
            imageUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            overview: movie.overview
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

export const fetchPeople = async () => {
    try {
        const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Fetch more pages to find more directors
        const promises = pages.map(page =>
            fetch(`${API_URL}/person/popular?page=${page}`, { headers }).then(res => res.json())
        );

        const results = await Promise.all(promises);
        const allPeople = results.flatMap(data => data.results || []);

        const mapPerson = (p: any) => ({
            id: p.id,
            name: p.name,
            imageUrl: p.profile_path ? `${IMAGE_BASE_URL}${p.profile_path}` : 'https://via.placeholder.com/150',
            avgRating: Math.min(10, (p.popularity / 5) + 5),
            filmCount: (p.known_for?.length || 0) * 8 + Math.floor(Math.random() * 30),
            bestFilm: p.known_for?.[0]?.title || p.known_for?.[0]?.name || 'Unknown',
            department: p.known_for_department
        });

        const formattedPeople = allPeople.map(mapPerson);

        let directors = formattedPeople.filter(p => p.department === 'Directing');
        let actors = formattedPeople.filter(p => p.department === 'Acting');

        // FALLBACK: If we still don't have enough directors, use a curated list of legends
        if (directors.length < 5) {
            const legendaryDirectorIds = [525, 488, 1032, 138, 608, 7467, 578, 2710, 60100, 137427];
            const legendPromises = legendaryDirectorIds.map(async (id) => {
                try {
                    const res = await fetch(`${API_URL}/person/${id}`, { headers });
                    const d = await res.json();
                    return {
                        id: d.id,
                        name: d.name,
                        imageUrl: d.profile_path ? `${IMAGE_BASE_URL}${d.profile_path}` : 'https://via.placeholder.com/150',
                        avgRating: 9.5,
                        filmCount: 35,
                        bestFilm: 'Legendary Works',
                        department: 'Directing'
                    };
                } catch (e) { return null; }
            });

            const legends = (await Promise.all(legendPromises)).filter((l): l is any => l !== null);
            directors = [...directors, ...legends].filter((v, i, a) => a.findIndex(t => t?.id === v?.id) === i);
        }

        const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

        return {
            directors: directors.slice(0, 15),
            actors: shuffle(actors).slice(0, 15)
        };
    } catch (error) {
        console.error('Error fetching people:', error);
        return { directors: [], actors: [] };
    }
};

export const fetchRecommendations = async () => {
    try {
        // Recommendations often need a movie ID. Using a popular movie ID (Inception: 27205) as a seed
        const response = await fetch(`${API_URL}/movie/27205/recommendations`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.slice(0, 6).map(mapMovie);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

export const searchPeople = async (query: string) => {
    try {
        const response = await fetch(`${API_URL}/search/person?query=${encodeURIComponent(query)}`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.map((p: any) => ({
            id: p.id,
            name: p.name,
            imageUrl: p.profile_path ? `${IMAGE_BASE_URL}${p.profile_path}` : 'https://via.placeholder.com/150',
            avgRating: Math.min(10, p.popularity / 3 + 4),
            filmCount: p.known_for?.length * 5 + Math.floor(Math.random() * 20) || 0,
            bestFilm: p.known_for?.[0]?.title || p.known_for?.[0]?.name || 'Unknown',
            department: p.known_for_department
        }));
    } catch (error) {
        console.error('Error searching people:', error);
        return [];
    }
};

export const getPersonDetails = async (personId: number) => {
    try {
        await fetchGenres();
        const response = await fetch(`${API_URL}/person/${personId}?append_to_response=movie_credits`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const person = await response.json();

        // Get top movies by popularity/vote count
        const movies = person.movie_credits?.cast || [];
        const sortedMovies = [...movies]
            .filter((m: any) => m.poster_path)
            .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 12)
            .map((m: any) => ({
                id: m.id,
                title: m.title,
                year: m.release_date ? m.release_date.split('-')[0] : 'N/A',
                rating: m.vote_average,
                imageUrl: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : null,
                character: m.character,
                genres: m.genre_ids ? m.genre_ids.map((id: number) => genreMap[id] || 'Unknown') : []
            }));

        return {
            id: person.id,
            name: person.name,
            biography: person.biography || 'No biography available.',
            birthday: person.birthday,
            placeOfBirth: person.place_of_birth,
            imageUrl: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : 'https://via.placeholder.com/300',
            knownFor: person.known_for_department,
            movies: sortedMovies,
            totalMovies: movies.length
        };
    } catch (error) {
        console.error('Error fetching person details:', error);
        return null;
    }
};

export const getDirectorDetails = async (directorId: number) => {
    try {
        await fetchGenres();
        const response = await fetch(`${API_URL}/person/${directorId}?append_to_response=movie_credits`, { headers });
        if (!response.ok) throw new Error('Network response was not ok');
        const director = await response.json();

        // Get top movies by popularity/vote count from crew (Directing)
        const movies = director.movie_credits?.crew?.filter((c: any) => c.job === 'Director') || [];
        const sortedMovies = [...movies]
            .filter((m: any) => m.poster_path)
            .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 12)
            .map((m: any) => ({
                id: m.id,
                title: m.title,
                year: m.release_date ? m.release_date.split('-')[0] : 'N/A',
                rating: m.vote_average,
                imageUrl: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : null,
                genres: m.genre_ids ? m.genre_ids.map((id: number) => genreMap[id] || 'Unknown') : []
            }));

        return {
            id: director.id,
            name: director.name,
            biography: director.biography || 'No biography available.',
            birthday: director.birthday,
            placeOfBirth: director.place_of_birth,
            imageUrl: director.profile_path ? `${IMAGE_BASE_URL}${director.profile_path}` : 'https://via.placeholder.com/300',
            movies: sortedMovies,
            totalMovies: movies.length
        };
    } catch (error) {
        console.error('Error fetching director details:', error);
        return null;
    }
};

export const fetchSmartRecommendations = async (movieId: number) => {
    try {
        await fetchGenres();
        // 1. Get movie details to get genres and cast
        const detailsResponse = await fetch(`${API_URL}/movie/${movieId}?append_to_response=credits`, { headers });
        if (!detailsResponse.ok) throw new Error('Failed to fetch movie details');
        const movie = await detailsResponse.json();

        const genreIds = movie.genres.map((g: any) => g.id);
        const topActors = movie.credits?.cast?.slice(0, 3).map((c: any) => c.id) || [];

        // 2. Fetch movies with same genres
        const genreQuery = genreIds.slice(0, 2).join(',');
        const responseByGenre = await fetch(`${API_URL}/discover/movie?with_genres=${genreQuery}&sort_by=popularity.desc&page=1`, { headers });
        const dataByGenre = await responseByGenre.json();

        // 3. Fetch movies with same actors (if available)
        let actorMovies: any[] = [];
        if (topActors.length > 0) {
            const actorQuery = topActors[0]; // Take the main star
            const responseByActor = await fetch(`${API_URL}/discover/movie?with_cast=${actorQuery}&sort_by=popularity.desc&page=1`, { headers });
            const dataByActor = await responseByActor.json();
            actorMovies = dataByActor.results || [];
        }

        // Combine and deduplicate
        const combined = [...actorMovies, ...dataByGenre.results]
            .filter(m => m.id !== movieId) // Remove original movie
            .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Unique
            .slice(0, 8);

        return combined.map((m: any) => mapMovie(m));
    } catch (error) {
        console.error('Error fetching smart recommendations:', error);
        return [];
    }
};

// ========================
// NEWS API INTEGRATION
// ========================

const NEWS_API_KEY = '5d35ad08e3bb465981908b48139859fb';
const NEWS_API_URL = 'https://newsapi.org/v2';

// Helper to get News API URL with CORS proxy if needed
const getProxiedNewsUrl = (endpoint: string, params: string) => {
    const baseUrl = `${NEWS_API_URL}${endpoint}?${params}&apiKey=${NEWS_API_KEY}`;

    // In production, we need a CORS proxy for NewsAPI.org
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`;
    }

    return baseUrl;
};

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    source: {
        name: string;
    };
    author: string | null;
}

// Helper to shuffle array randomly
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Keywords that indicate actor/celebrity news
const ACTOR_KEYWORDS = [
    'actor', 'actress', 'celebrity', 'star', 'cast', 'starring', 'role',
    'performance', 'oscar', 'emmy', 'golden globe', 'award', 'red carpet',
    'hollywood', 'bollywood', 'premiere', 'interview', 'tom hanks', 'tom cruise',
    'leonardo dicaprio', 'brad pitt', 'johnny depp', 'keanu reeves', 'ryan gosling',
    'timothee chalamet', 'zendaya', 'margot robbie', 'scarlett johansson',
    'jennifer lawrence', 'anne hathaway', 'emma stone', 'florence pugh',
    'dwayne johnson', 'chris hemsworth', 'chris evans', 'robert downey',
    'samuel jackson', 'morgan freeman', 'denzel washington', 'will smith',
    'meryl streep', 'cate blanchett', 'viola davis', 'sydney sweeney',
    'jacob elordi', 'pedro pascal', 'austin butler', 'anya taylor-joy',
    'jason momoa', 'gal gadot', 'henry cavill', 'benedict cumberbatch',
    'entertainment', 'celebrity news', 'showbiz', 'film star'
];

// Keywords that indicate movie news
const MOVIE_KEYWORDS = [
    'movie', 'film', 'cinema', 'box office', 'blockbuster', 'sequel', 'prequel',
    'franchise', 'trailer', 'release date', 'netflix', 'disney', 'marvel', 'dc',
    'warner bros', 'paramount', 'universal', 'sony pictures', 'amazon prime',
    'hbo max', 'streaming', 'theatrical', 'imax', 'screen', 'director',
    'screenplay', 'production', 'filming', 'post-production', 'vfx',
    'box office hit', 'weekend gross', 'opening weekend', 'billion dollar',
    'avengers', 'spider-man', 'batman', 'superman', 'star wars', 'jurassic',
    'fast furious', 'mission impossible', 'james bond', 'harry potter',
    'lord of the rings', 'avatar', 'barbie', 'oppenheimer', 'dune',
    'horror movie', 'comedy film', 'action movie', 'drama film', 'thriller',
    'animated film', 'pixar', 'dreamworks', 'studio ghibli', 'a24',
    'sundance', 'cannes', 'toronto film festival', 'venice film festival',
    'academy awards', 'oscars', 'critics choice', 'bafta', 'sag awards'
];

// Keywords to EXCLUDE - these indicate non-entertainment news
const BLACKLIST_KEYWORDS = [
    'politics', 'election', 'vote', 'senator', 'congress', 'parliament',
    'president biden', 'president trump', 'republican', 'democrat', 'political',
    'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'nft', 'blockchain',
    'stock market', 'stocks', 'trading', 'investment fund', 'hedge fund',
    'sports betting', 'gambling', 'casino', 'lottery',
    'covid', 'pandemic', 'vaccine', 'virus', 'outbreak',
    'murder', 'killed', 'shooting', 'crime scene', 'arrested', 'prison',
    'war', 'military', 'troops', 'invasion', 'missile', 'bombing',
    'lawsuit against', 'sued for', 'legal battle', 'court case',
    'real estate', 'mortgage', 'housing market', 'property prices',
    'weather', 'hurricane', 'earthquake', 'flood', 'wildfire',
    'tech stocks', 'ipo', 'startup funding', 'venture capital',
    'football', 'basketball', 'baseball', 'soccer', 'nfl', 'nba', 'mlb',
    'tennis', 'golf', 'olympics', 'world cup', 'super bowl'
];

// Trusted entertainment news sources get priority
const TRUSTED_SOURCES = [
    'entertainment weekly', 'variety', 'hollywood reporter', 'deadline',
    'screen rant', 'collider', 'indiewire', 'ew.com', 'e! news', 'people',
    'tmz', 'buzzfeed', 'vulture', 'the wrap', 'cinemablend', 'gamespot',
    'ign', 'empire', 'total film', 'movie web', 'slashfilm', 'film school rejects'
];

// Check if text contains any keyword from a list (case-insensitive)
const containsKeyword = (text: string, keywords: string[]): boolean => {
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

// Check if the article is from a trusted entertainment source
const isTrustedSource = (sourceName: string): boolean => {
    const lowerSource = sourceName.toLowerCase();
    return TRUSTED_SOURCES.some(source => lowerSource.includes(source));
};

// Calculate relevance score for an article
const calculateRelevanceScore = (article: any, type: 'actors' | 'movies'): number => {
    const title = article.title || '';
    const description = article.description || '';
    const content = `${title} ${description}`;
    const sourceName = article.source?.name || '';

    let score = 0;

    // Check for blacklisted content - immediately disqualify
    if (containsKeyword(content, BLACKLIST_KEYWORDS)) {
        return -1;
    }

    // Bonus for trusted sources
    if (isTrustedSource(sourceName)) {
        score += 30;
    }

    // Check for relevant keywords based on type
    const relevantKeywords = type === 'actors' ? ACTOR_KEYWORDS : MOVIE_KEYWORDS;

    // Count keyword matches
    relevantKeywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
            score += 10;
        }
    });

    // Extra bonus if title contains keywords (more important than description)
    relevantKeywords.forEach(keyword => {
        if (title.toLowerCase().includes(keyword.toLowerCase())) {
            score += 15;
        }
    });

    return score;
};

// Map news article from API response
const mapNewsArticle = (article: any, index: number): NewsArticle => ({
    id: `${article.publishedAt}-${index}`,
    title: article.title || 'No Title',
    description: article.description || 'No description available.',
    url: article.url,
    urlToImage: article.urlToImage,
    publishedAt: article.publishedAt,
    source: {
        name: article.source?.name || 'Unknown Source'
    },
    author: article.author
});

// Fetch actors/celebrities news with smart filtering
export const fetchActorsNews = async (limit: number = 10): Promise<NewsArticle[]> => {
    try {
        // More specific search query for actors/celebrities
        const searchQuery =
            '("actor" OR "actress" OR "celebrity" OR "Hollywood star" OR "movie star") AND (film OR movie OR premiere OR award OR interview)';

        const params = `q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=100`;
        const url = getProxiedNewsUrl('/everything', params);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch actors news');
        }

        const data = await response.json();

        if (data.status !== 'ok' || !data.articles) {
            console.error('News API error:', data);
            return [];
        }

        // Score and filter articles
        const scoredArticles = data.articles
            .filter((article: any) =>
                article.urlToImage &&
                article.title &&
                !article.title.includes('[Removed]') &&
                article.description
            )
            .map((article: any) => ({
                article,
                score: calculateRelevanceScore(article, 'actors')
            }))
            .filter((item: { score: number }) => item.score > 20) // Must have minimum relevance
            .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

        // Map to NewsArticle format
        const validArticles: NewsArticle[] = scoredArticles
            .slice(0, Math.min(limit * 3, scoredArticles.length))
            .map((item: { article: any }, index: number) => mapNewsArticle(item.article, index));

        // Shuffle for variety while keeping high-relevance articles
        return shuffleArray(validArticles).slice(0, limit);
    } catch (error) {
        console.error('Error fetching actors news:', error);
        return [];
    }
};

// Fetch movies news with smart filtering
export const fetchMoviesNews = async (limit: number = 10): Promise<NewsArticle[]> => {
    try {
        // More specific search query for movies
        const searchQuery =
            '("movie" OR "film" OR "cinema" OR "box office" OR "blockbuster") AND (release OR trailer OR review OR premiere OR streaming)';

        const params = `q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=100`;
        const url = getProxiedNewsUrl('/everything', params);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch movies news');
        }

        const data = await response.json();

        if (data.status !== 'ok' || !data.articles) {
            console.error('News API error:', data);
            return [];
        }

        // Score and filter articles
        const scoredArticles = data.articles
            .filter((article: any) =>
                article.urlToImage &&
                article.title &&
                !article.title.includes('[Removed]') &&
                article.description
            )
            .map((article: any) => ({
                article,
                score: calculateRelevanceScore(article, 'movies')
            }))
            .filter((item: { score: number }) => item.score > 20) // Must have minimum relevance
            .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

        // Map to NewsArticle format
        const validArticles: NewsArticle[] = scoredArticles
            .slice(0, Math.min(limit * 3, scoredArticles.length))
            .map((item: { article: any }, index: number) => mapNewsArticle(item.article, index));

        // Shuffle for variety while keeping high-relevance articles
        return shuffleArray(validArticles).slice(0, limit);
    } catch (error) {
        console.error('Error fetching movies news:', error);
        return [];
    }
};

// Fetch combined breaking news (actors + movies)
export const fetchBreakingNews = async (limit: number = 6): Promise<NewsArticle[]> => {
    try {
        const [actorsNews, moviesNews] = await Promise.all([
            fetchActorsNews(limit),
            fetchMoviesNews(limit)
        ]);

        // Combine both arrays
        const combined = [...actorsNews, ...moviesNews];

        // Remove duplicates based on title similarity
        const uniqueNews: NewsArticle[] = [];
        const seenTitles = new Set<string>();

        for (const article of combined) {
            // Create a simplified title for comparison
            const simplifiedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);

            if (!seenTitles.has(simplifiedTitle)) {
                seenTitles.add(simplifiedTitle);
                uniqueNews.push(article);
            }
        }

        // Sort by date (newest first) and shuffle for variety
        const sortedByDate = uniqueNews.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Shuffle top results for randomness on refresh
        const topNews = sortedByDate.slice(0, Math.min(limit * 2, sortedByDate.length));
        return shuffleArray(topNews).slice(0, limit);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        return [];
    }
};

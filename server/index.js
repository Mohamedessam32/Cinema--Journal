const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;
const TMDB_API_KEY = '6e6bbb0bcadecf02d466fa7b5b37a1b6';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.use(cors());
app.use(express.json());

// Helper to fetch from TMDB
const fetchTMDB = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                ...params,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`TMDB Error [${endpoint}]:`, error.response?.data || error.message);
        throw error;
    }
};

// Routes

// Get movies (popular, top_rated)
app.get('/api/movies', async (req, res) => {
    const { type = 'popular', limit } = req.query;
    const endpoint = type === 'top_rated' ? '/movie/top_rated' : '/movie/popular';

    try {
        const data = await fetchTMDB(endpoint);
        let movies = data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            rating: movie.vote_average,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            genres: movie.genre_ids, // We might need to map IDs to names if needed, but for now IDs are passed
            overview: movie.overview
        }));

        if (limit) {
            movies = movies.slice(0, parseInt(limit));
        }

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
    }
});

// Get people (popular)
app.get('/api/people', async (req, res) => {
    try {
        const data = await fetchTMDB('/person/popular');
        // Simple heuristic: separate by known_for_department or just return mixed
        // TMDB returns mixed list. We will try to categorize.

        const directors = data.results.filter(p => p.known_for_department === 'Directing').slice(0, 4).map(p => ({
            name: p.name,
            avgRating: 8.0, // Mocked as TMDB person endpoint doesn't give avg rating of all their films easily
            filmCount: p.known_for.length,
            bestFilm: p.known_for[0]?.title || 'Unknown',
            imageUrl: p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : null
        }));

        const actors = data.results.filter(p => p.known_for_department === 'Acting').slice(0, 4).map(p => ({
            name: p.name,
            avgRating: 8.5, // Mocked
            filmCount: p.known_for.length,
            bestFilm: p.known_for[0]?.title || 'Unknown',
            imageUrl: p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : null
        }));

        res.json({ directors, actors });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch people' });
    }
});

// Get trends (using trending endpoint)
app.get('/api/trends', async (req, res) => {
    try {
        const data = await fetchTMDB('/trending/all/week');

        // Process data to mimic our previous trends structure or provide raw data
        // We will return a structure that fits the frontend expectations

        const trends = {
            risingGenres: [
                { name: "Action", increase: 45 },
                { name: "Sci-Fi", increase: 32 },
                { name: "Drama", increase: 20 }
            ],
            popularTopics: [
                {
                    title: "Trending Movies this Week",
                    description: "Top movies currently being watched globally."
                },
                {
                    title: "Rising Stars",
                    description: "Actors gaining rapid popularity."
                }
            ],
            // Let's create some chart data based on the results
            chartData: data.results.slice(0, 10).map(item => ({
                name: item.title || item.name,
                popularity: item.popularity
            }))
        };

        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

// Get recommendations (using a movie ID - defaulting to a popular one like Inception 27205 for general recs if no ID provided)
app.get('/api/recommendations', async (req, res) => {
    try {
        // 27205 = Inception, just as a seed
        const data = await fetchTMDB('/movie/27205/recommendations');

        const movies = data.results.slice(0, 12).map(movie => ({
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            director: 'Unknown', // Recs endpoint doesn't give director
            rating: movie.vote_average,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            genres: movie.genre_ids
        }));

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// Search movies
app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });

    try {
        const data = await fetchTMDB('/search/movie', { query });
        const movies = data.results.slice(0, 5).map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            director: 'Unknown', // Search endpoint doesn't return director
            rating: movie.vote_average,
            duration: 0, // Search endpoint doesn't return runtime
            genres: movie.genre_ids, // IDs
            cast: [], // Search endpoint doesn't return cast
            budget: 'N/A',
            boxOffice: 'N/A',
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            overview: movie.overview
        }));
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// Get movie details (for comparison to get full details like budget/runtime)
app.get('/api/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await fetchTMDB(`/movie/${id}`, { append_to_response: 'credits' });

        // Map genres
        const genres = movie.genres.map(g => g.name);

        // Map cast
        const cast = movie.credits.cast.slice(0, 3).map(c => c.name);

        // Find director
        const director = movie.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown';

        res.json({
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            director: director,
            rating: movie.vote_average,
            duration: movie.runtime,
            genres: genres,
            cast: cast,
            budget: movie.budget ? `$${(movie.budget / 1000000).toFixed(1)} million` : 'N/A',
            boxOffice: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)} million` : 'N/A',
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

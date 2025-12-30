import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">
              Cinema <span className="text-blue-500">Journal</span>
            </h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Your daily source for movie discovery, cinematic excellence, and Hollywood updates. We bring the world of film to your screen with in-depth analysis and personalized recommendations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Access</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('news')} className="hover:text-blue-400 transition-colors">News</button></li>
              <li><button onClick={() => onNavigate('movies')} className="hover:text-blue-400 transition-colors">Movies</button></li>
              <li><button onClick={() => onNavigate('topRated')} className="hover:text-blue-400 transition-colors">Top Rated</button></li>
              <li><button onClick={() => onNavigate('famousActors')} className="hover:text-blue-400 transition-colors">Actors</button></li>
              <li><button onClick={() => onNavigate('famousDirectors')} className="hover:text-blue-400 transition-colors">Directors</button></li>
              <li><button onClick={() => onNavigate('filmOneriler')} className="hover:text-blue-400 transition-colors">AI Recs</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Cinema Journal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
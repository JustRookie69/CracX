import React from 'react';
import GameCard from '../../components/gameCard/GameCard';
import './questPage.css';

// Dummy data for the games
const gamesData = [
    { id: 1, name: 'Physics Force Field', imageUrl: 'https://via.placeholder.com/300x160/7FDBFF/000000?text=Physics+Game', played: true, userRank: '#54' },
    { id: 2, name: 'Chem Catalyst', imageUrl: 'https://via.placeholder.com/300x160/2ECC40/FFFFFF?text=Chemistry+Game', played: false, globalPlayers: '1.2M' },
    { id: 3, name: 'Calculus Clash', imageUrl: 'https://via.placeholder.com/300x160/FF851B/FFFFFF?text=Maths+Game', played: true, userRank: '#102' },
    { id: 4, name: 'Biology Blitz', imageUrl: 'https://via.placeholder.com/300x160/FF4136/FFFFFF?text=Biology+Game', played: false, globalPlayers: '850K' },
    { id: 5, name: 'Organic Odyssey', imageUrl: 'https://via.placeholder.com/300x160/F012BE/FFFFFF?text=Organic+Chem', played: false, globalPlayers: '450K' },
    { id: 6, name: 'Vector Voyage', imageUrl: 'https://via.placeholder.com/300x160/0074D9/FFFFFF?text=Vectors', played: true, userRank: '#211' },
];

const QuestPage = () => {
    return (
        <div className="quest-page">
            <h1 className="quest-page-title">Explore Educational Games</h1>
            <div className="game-grid">
                {gamesData.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

export default QuestPage;
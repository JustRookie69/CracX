import React from 'react';
import './gameCard.css';

const GameCard = ({ game }) => {
    return (
        <div className="game-card">
            <img src={game.imageUrl} alt={game.name} className="game-image" />
            <div className="game-info">
                <h3 className="game-name">{game.name}</h3>
                <div className="game-details">
                    {game.played ? (
                        <div className="user-rank-info">
                            <span>Your Rank</span>
                            <strong>{game.userRank}</strong>
                        </div>
                    ) : (
                        <div className="global-data-info">
                            <span>Players</span>
                            <strong>{game.globalPlayers}</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameCard;
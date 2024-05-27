// src/pages/GamePage.js
import React, { useState } from 'react';
import PlayerBoard from '../components/GameBoard.jsx';
import TopPlayers from '../components/topPlayers.jsx';

const Game = ({ players }) => {
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);

    const handleMove = () => {
        setActivePlayerIndex((activePlayerIndex + 1) % players.length);
    };

    const handleFinish = (player) => {
        const index = players.findIndex(p => p.id === player.id);
        if (index !== -1) {
            players.splice(index, 1);
            if (players.length === 0) {
                alert('All players have finished their games!');
            } else {
                setActivePlayerIndex(activePlayerIndex % players.length);
            }
        }
    };

    return (
        <div>
            <h1>Game Page</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {players.map((player, index) => (
                    <PlayerBoard
                        key={player.id}
                        player={player}
                        isActive={index === activePlayerIndex}
                        onMove={handleMove}
                        onFinish={handleFinish}
                    />
                ))}
            </div>
            <TopPlayers />
        </div>
    );
};

export default Game;

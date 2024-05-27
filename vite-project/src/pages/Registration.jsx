// src/pages/RegistrationPage.js
import React, { useState } from 'react';
import PlayerForm from '../components/PlayerRegistration.jsx';
import { Link } from 'react-router-dom';

const RegistrationPage = ({ onRegister }) => {
    const [players, setPlayers] = useState([]);

    const handleRegister = (player) => {
        setPlayers([...players, player]);
        onRegister(player);
    };

    return (
        <div>
            <h1>Register Players</h1>
            <PlayerForm onRegister={handleRegister} />
            <div>
                <h2>Registered Players</h2>
                <ul>
                    {players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
            </div>
            {players.length > 0 && (
                <Link to="/game">Start Game</Link>
            )}
        </div>
    );
};

export default RegistrationPage;

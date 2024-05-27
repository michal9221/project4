import React, { useState } from 'react';

const PlayerRegistration = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [isReturningPlayer, setIsReturningPlayer] = useState(false);
  const playersFromLocalStorage = JSON.parse(localStorage.getItem('players')) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const playerExists = playersFromLocalStorage.some(player => player.name === name);
    if (isReturningPlayer && !playerExists) {
      alert("Returning player not found.");
    } else {
      onRegister(name, isReturningPlayer);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter player name"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isReturningPlayer}
          onChange={() => setIsReturningPlayer(!isReturningPlayer)}
        />
        Returning player
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default PlayerRegistration;
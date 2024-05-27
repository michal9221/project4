import React, { useState, useEffect } from 'react';

const GameBoard = ({ player, isActive, onAction, onNumberChange }) => {
  const [currentNumber, setCurrentNumber] = useState(player.currentNumber);
  const [actionCount, setActionCount] = useState(player.actionCount);

  useEffect(() => {
    if (currentNumber === 100) {
      onAction(player.name, actionCount);
    }
  }, [currentNumber, onAction, player.name, actionCount]);

  const handleAction = (action) => {
    if (!isActive) return;

    let newNumber = currentNumber;
    switch (action) {
      case '+1':
        newNumber += 1;
        break;
      case '-1':
        newNumber -= 1;
        break;
      case '*2':
        newNumber *= 2;
        break;
      case '/2':
        newNumber = Math.floor(newNumber / 2);
        break;
      default:
        break;
    }

    setCurrentNumber(newNumber);
    setActionCount(actionCount + 1);
    onNumberChange(player.name, newNumber, actionCount + 1);
  };

  return (
    <div className={`game-board ${isActive ? 'active' : ''}`}>
      <h3>{player.name}</h3>
      <p>Current Number: {currentNumber}</p>
      <p>Actions: {actionCount}</p>
      <button onClick={() => handleAction('+1')} disabled={!isActive}>+1</button>
      <button onClick={() => handleAction('-1')} disabled={!isActive}>-1</button>
      <button onClick={() => handleAction('*2')} disabled={!isActive}>*2</button>
      <button onClick={() => handleAction('/2')} disabled={!isActive}>/2</button>
      <h4>Achievements:</h4>
      <ul>
        {player.games.map((game, index) => (
          <li key={index}>Game {index + 1}: {game} steps</li>
        ))}
      </ul>
    </div>
  );
};

export default GameBoard;

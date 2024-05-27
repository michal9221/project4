import React, { useState, useEffect } from 'react';
import './App.css';
import PlayerRegistration from './components/PlayerRegistration.jsx';
import GameBoard from './components/GameBoard.jsx';
const getRandomNumber = () => Math.floor(Math.random() * 100);
const getPlayerFromLocalStorage = () => JSON.parse(localStorage.getItem('players')) || [];
const savePlayerToLocalStorage = (players) => localStorage.setItem('players', JSON.stringify(players));

const calculateTopPlayers = (players) => {
  return players
    .filter(player => player.games.length > 0)
    .map(player => ({
      name: player.name,
      averageActions: player.games.reduce((a, b) => a + b, 0) / player.games.length,
    }))
    .sort((a, b) => a.averageActions - b.averageActions)
    .slice(0, 3);
};

const App = () => {
  const [players, setPlayers] = useState(getPlayerFromLocalStorage());
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRegistering, setIsRegistering] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [playerDecisions, setPlayerDecisions] = useState({});
  const [topPlayers, setTopPlayers] = useState(calculateTopPlayers(players));

  useEffect(() => {
    savePlayerToLocalStorage(players);
    setTopPlayers(calculateTopPlayers(players));
  }, [players]);

  const handleRegister = (name, isReturningPlayer) => {
    let player = players.find(p => p.name === name);
    if (!player) {
      player = { name, games: [], currentNumber: getRandomNumber(), actionCount: 0 };
      setPlayers([...players, player]);
    } else {
      player.currentNumber = getRandomNumber();
      player.actionCount = 0;
      if (!isReturningPlayer) {
        player.games = [];
      }
      setPlayers([...players]);
    }
    setRegisteredPlayers([...registeredPlayers, player]);
  };

  const handleAction = (playerName, actionCount) => {
    setPlayers(players.map(player => {
      if (player.name === playerName) {
        player.games.push(actionCount);
      }
      return player;
    }));
    setGameFinished(true);
  };

  const handleNumberChange = (playerName, currentNumber, actionCount) => {
    setPlayers(players.map(player => {
      if (player.name === playerName) {
        player.currentNumber = currentNumber;
        player.actionCount = actionCount;
      }
      return player;
    }));
    setCurrentPlayerIndex((currentPlayerIndex + 1) % registeredPlayers.length);
  };

  const handlePlayerDecision = (playerName, decision) => {
    setPlayerDecisions(prevDecisions => ({
      ...prevDecisions,
      [playerName]: decision
    }));
  };

  useEffect(() => {
    if (Object.keys(playerDecisions).length === registeredPlayers.length && gameFinished) {
      const playersContinuing = registeredPlayers.filter(player => playerDecisions[player.name] === 'continue');
      if (playersContinuing.length > 0) {
        const updatedPlayers = playersContinuing.map(player => ({
          ...player,
          currentNumber: getRandomNumber(),
          actionCount: 0
        }));
        setRegisteredPlayers(updatedPlayers);
        setGameFinished(false);
        setPlayerDecisions({});
        setCurrentPlayerIndex(0);
      } else {
        handleExit();
      }
    }
  }, [playerDecisions, registeredPlayers.length, gameFinished]);

  const handleExit = () => {
    setRegisteredPlayers([]);
    setIsRegistering(true);
    setGameFinished(false);
  };

  const currentPlayer = registeredPlayers[currentPlayerIndex];

  if (isRegistering) {
    return (
      <div className="app">
        <h1>Register Players</h1>
        <PlayerRegistration onRegister={handleRegister} />
        {registeredPlayers.length > 0 && (
          <button onClick={() => setIsRegistering(false)}>Start Game</button>
        )}
        {topPlayers.length > 0 && (
          <div>
            <h2>Top Players</h2>
            <ol>
              {topPlayers.map(player => (
                <li key={player.name}>
                  {player.name}: Average Actions = {player.averageActions.toFixed(2)}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="app">
        <h1>Game Finished!</h1>
        {registeredPlayers.map((player) => (
          <div key={player.name}>
            <p>{player.name}, do you want to continue or exit?</p>
            <button onClick={() => handlePlayerDecision(player.name, 'continue')}>Continue</button>
            <button onClick={() => handlePlayerDecision(player.name, 'exit')}>Exit</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-boards">
        {registeredPlayers.map((player, index) => (
          <GameBoard
            key={player.name}
            player={player}
            isActive={player.name === currentPlayer.name}
            onAction={handleAction}
            onNumberChange={handleNumberChange}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
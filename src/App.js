import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ContractManager from './ContractManager';
import GameUI from './GameUI';
import SocialAndNotifications from './SocialAndNotifications';
import IntroDialog from './IntroDialog';
import HowToPlay from './HowToPlay';

function App() {
  const [signer, setSigner] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({
    position: 1,
    hasAntidote: false,
    isActive: false,
    diceRollCount: 0,
    lastDiceRoll: 0,
    group: 0,
    lastActivityTime: 0,
    lastRollTime: 0,
    joinedAt: 0,
    antidoteCount: 0,
    snakeEncounters: 0,
  });
  const [destination, setDestination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activePlayers, setActivePlayers] = useState(0);
  const [events, setEvents] = useState([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [walletId, setWalletId] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [contractActions, setContractActions] = useState({
    joinGame: null,
    rollDice: null,
    buyAntidote: null,
    handleWalletConnect: null,
  });
  const howToPlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (howToPlayRef.current && !howToPlayRef.current.contains(event.target)) {
        setShowHowToPlay(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="app">
      <IntroDialog
        onYesClick={() => setShowWalletConnect(true)}
        onNoClick={() => console.log('User clicked No')}
        isWalletConnected={isWalletConnected}
      />
      <ContractManager
        signer={signer}
        setSigner={setSigner}
        fullAddress={fullAddress}
        setFullAddress={setFullAddress}
        setWalletId={setWalletId}
        setIsWalletConnected={setIsWalletConnected}
        setPlayerInfo={setPlayerInfo}
        setActivePlayers={setActivePlayers}
        setPrizePool={setPrizePool}
        setEvents={setEvents}
        setLoading={setLoading}
        setIsRolling={setIsRolling}
        setDestination={setDestination}
        playerInfo={playerInfo}
        setContractActions={setContractActions}
        isWalletConnected={isWalletConnected} // اضافه کردن پراپ
      />
      <GameUI
        playerInfo={playerInfo}
        destination={destination}
        isWalletConnected={isWalletConnected}
        walletId={walletId}
        showWalletConnect={showWalletConnect}
        prizePool={prizePool}
        activePlayers={activePlayers}
        isRolling={isRolling}
        loading={loading}
        setShowHowToPlay={setShowHowToPlay}
        showHowToPlay={showHowToPlay}
        howToPlayRef={howToPlayRef}
        joinGame={contractActions.joinGame}
        rollDice={contractActions.rollDice}
        buyAntidote={contractActions.buyAntidote}
        handleWalletConnect={contractActions.handleWalletConnect}
      />
      <SocialAndNotifications events={events} />
    </div>
  );
}

export default App;
import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import DiceAnimation from './DiceAnimation';
import HowToPlay from './HowToPlay';
import WalletConnect from './WalletConnect';
import redFrogImage from './pic/redforg.svg';
import playIcon from './pic/Play.svg';
import antidoteIcon from './pic/antidot.png';
import prizeIcon from './pic/prize.gif';

const GameUI = ({
  playerInfo,
  destination,
  isWalletConnected,
  walletId,
  showWalletConnect,
  prizePool,
  activePlayers,
  isRolling,
  loading,
  setShowHowToPlay,
  showHowToPlay,
  howToPlayRef,
  joinGame,
  rollDice,
  buyAntidote,
  handleWalletConnect,
}) => {
  const calculateLifeTimePercentage = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedTime = currentTime - playerInfo.lastActivityTime;
    const totalDuration = 24 * 60 * 60;
    const remainingTime = Math.max(totalDuration - elapsedTime, 0);
    return (remainingTime / totalDuration) * 100;
  };

  // لاگ برای دیباگ پراپ‌ها و شرایط رندر
  useEffect(() => {
    console.log('GameUI Props:', {
      isWalletConnected,
      walletId,
      showWalletConnect,
      handleWalletConnect,
      joinGame,
      rollDice,
      buyAntidote,
    });
  }, [isWalletConnected, walletId, showWalletConnect, handleWalletConnect, joinGame, rollDice, buyAntidote]);

  // لاگ برای دیباگ رندر دکمه
  useEffect(() => {
    console.log('WalletConnect Render Status:', {
      showWalletConnect,
      isWalletConnected,
      walletId,
    });
  }, [showWalletConnect, isWalletConnected, walletId]);

  return (
    <>
      <h1
        className="neon-text"
        style={{
          fontFamily: 'Barriecito-Regular',
          color: '#006400',
          textShadow: '0 0 10px #32CD32, 0 0 15px #32CD32, 0 0 20px #32CD32',
        }}
      >
        Snakes and Legend Frog
      </h1>
      <button
        onClick={() => setShowHowToPlay(true)}
        className="how-to-play-button"
        style={{ margin: '20px auto', display: 'flex', alignItems: 'center' }}
      >
        <img src={playIcon} alt="How to Play" className="how-to-play-icon" />
        <span
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          How to Play
        </span>
      </button>
      {!walletId && !isWalletConnected && showWalletConnect ? (
        <WalletConnect
          onConnect={handleWalletConnect}
          className="game-ui-wallet-connect"
        />
      ) : walletId ? (
        <p
          className="neon-text"
          style={{
            marginBottom: '20px',
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Wallet ID: {walletId}
        </p>
      ) : null}
      <div
        className="prize-pool-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}
      >
        <img
          src={prizeIcon}
          alt="Prize Pool"
          style={{ width: '100px', height: '120px', marginRight: '10px', marginTop: '-20px' }}
        />
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Frog Ribbit: {prizePool} tBNB
        </p>
      </div>
      <p
        className="neon-text"
        style={{
          marginBottom: '20px',
          color: '#006400',
          textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
        }}
      >
        Active Players: {activePlayers}
      </p>
      <GameBoard
        playerPosition={playerInfo.position}
        destination={destination}
        isWalletConnected={isWalletConnected}
      />
      <div className="player-info" style={{ fontFamily: 'CustomFont' }}>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Position: {playerInfo.position}
        </p>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Antidote: {playerInfo.antidoteCount > 0 ? playerInfo.antidoteCount : 0}
        </p>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Alive?: {playerInfo.isActive ? 'Yes' : 'No'}
        </p>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Rolled Dice: {playerInfo.diceRollCount !== undefined ? playerInfo.diceRollCount : 'N/A'}
        </p>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Last Dice: {playerInfo.lastDiceRoll !== undefined ? playerInfo.lastDiceRoll : 'N/A'}
        </p>
        <p
          className="neon-text"
          style={{
            color: '#006400',
            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32',
          }}
        >
          Poisoned: {playerInfo.snakeEncounters}
        </p>
      </div>
      <div className="life-time-container">
        <label htmlFor="life-time">Life Time:</label>
        <div className="life-time-bar">
          <div className="life-time-progress" style={{ width: `${calculateLifeTimePercentage()}%` }}></div>
        </div>
      </div>
      <div
        className="join-game-container"
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      >
        <button
          disabled={!isWalletConnected || loading}
          onClick={joinGame}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <img src={redFrogImage} alt="Join Game" style={{ width: '150px', height: '150px' }} />
          <div
            className="tooltip"
            style={{
              visibility: 'visible',
              width: '120px',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '5px',
              padding: '5px',
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          >
            Buy your Frog
          </div>
        </button>
      </div>
      <div className="dice-container">
        <button disabled={!isWalletConnected || loading || !playerInfo.isActive} onClick={rollDice}>
          <DiceAnimation
            isRolling={isRolling}
            lastDiceRoll={playerInfo.lastDiceRoll}
            onRollComplete={(result) => console.log('Dice roll completed with result:', result)}
          />
        </button>
      </div>
      <div
        className="buy-antidote-container"
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}
      >
        <button
          disabled={!isWalletConnected || loading || !playerInfo.isActive}
          onClick={buyAntidote}
          className="buy-antidote-button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '50%',
            width: '120px',
            height: '100px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img src={antidoteIcon} alt="Buy Antidote" style={{ width: '100%', height: '100%' }} />
        </button>
        <div
          className="tooltip"
          style={{
            width: '150px',
            backgroundColor: 'rgba(0, 100, 0, 0.9)',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '5px',
            padding: '5px',
            position: 'absolute',
            bottom: '80%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          Buy antidote for your frog!
        </div>
      </div>
      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} ref={howToPlayRef} />}
    </>
  );
};

export default GameUI;
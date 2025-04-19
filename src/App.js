// src/App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import DiceRollingGameABI from './SnakeGame.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import redFrogImage from './pic/redforg.svg';
import handGif from './pic/hand.gif';
import instagramIcon from './pic/instagram.png';
import telegramIcon from './pic/telegram.png';
import socialxIcon from './pic/socialx.png';
import heartIcon from './pic/redforg.svg';
import prizeIcon from './pic/prize.gif';
import WalletConnect from './walletconnect';
import GameBoard from './GameBoard';
import DiceAnimation from './DiceAnimation';
import HowToPlay from './HowToPlay';
import playIcon from './pic/Play.svg';
import antidoteIcon from './pic/antidot.png';

const contractAddress = '0xDa14e06ed17CEE5C0c3DD47D2ea172b884386789';
const donationAddress = '0xC776f5fDB11eC7897cbc18a4005390eb1D7DeC62';

function App() {
    const [signer, setSigner] = useState(null);
    const [playerInfo, setPlayerInfo] = useState({
        position: 1,
        hasAntidote: false,
        isActive: true,
        diceRollCount: 0,
        lastDiceRoll: 0,
        group: 0,
        lastActivityTime: 0,
        lastRollTime: 0,
        joinedAt: 0,
        antidoteCount: 0,
        snakeEncounters: 0,
    });
    const [destination, setDestination] = useState(1); // برای انیمیشن‌های پس از پرتاب تاس
    const [loading, setLoading] = useState(false);
    const [activePlayers, setActivePlayers] = useState(0);
    const [events, setEvents] = useState([]);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [walletId, setWalletId] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [prizePool, setPrizePool] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false); // پرچم اتصال کیف‌پول
    const howToPlayRef = useRef(null);

    const getPlayerDetails = useCallback(async (playerAddress) => {
        if (!signer || !playerAddress || !ethers.isAddress(playerAddress)) {
            console.log('Invalid signer or playerAddress:', playerAddress);
            toast.error('Invalid wallet address.');
            return;
        }
        try {
            console.log(`Fetching player details for address: ${playerAddress}`);
            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const playerStatus = await contract.getPlayerStatus(playerAddress);

            const [
                position,
                hasAntidote,
                isActive,
                diceRollCount,
                lastDiceRoll,
                group,
                lastActivityTime,
                lastRollTime,
                joinedAt,
                antidoteCount,
                snakeEncounters
            ] = playerStatus;

            const updatedPlayerInfo = {
                position: Number(position),
                hasAntidote,
                isActive,
                diceRollCount: Number(diceRollCount),
                lastDiceRoll: Number(lastDiceRoll),
                group: Number(group),
                lastActivityTime: Number(lastActivityTime),
                lastRollTime: Number(lastRollTime),
                joinedAt: Number(joinedAt),
                antidoteCount: Number(antidoteCount),
                snakeEncounters: Number(snakeEncounters),
            };

            console.log('Player details fetched:', updatedPlayerInfo);
            setPlayerInfo(updatedPlayerInfo);
            setDestination(updatedPlayerInfo.position); // تنظیم destination برای انیمیشن‌های بعدی
        } catch (error) {
            console.error("Failed to fetch player details:", error);
            const errorMessage = error.message.includes('network')
                ? "Network error - please check your connection"
                : "Failed to load player details. Please try again.";
            toast.error(errorMessage);
        }
    }, [signer]);

    const fetchActivePlayers = useCallback(async () => {
        if (!signer) return;
        try {
            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const count = await contract.getActivePlayers();
            setActivePlayers(Number(count));
            console.log(`Active players: ${count}`);
        } catch (error) {
            console.error("Failed to fetch active players:", error);
            toast.error("Error fetching active players.");
        }
    }, [signer]);

    const fetchGameData = useCallback(async () => {
        if (!signer) return;
        try {
            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const [fetchedPrizePool] = await contract.getPrizePoolAndWinners();
            const prizePoolValue = ethers.formatUnits(fetchedPrizePool, 18);
            setPrizePool(prizePoolValue);
            console.log(`Prize pool: ${prizePoolValue} tBNB`);
        } catch (error) {
            console.error("Failed to fetch game data:", error);
            toast.error("Failed to load game data. Please refresh the page.");
        }
    }, [signer]);

    const handleWalletConnect = useCallback(async (account, signer) => {
        try {
            setSigner(signer);
            setWalletId(account.substring(0, 6));
            setFullAddress(account);
            setIsWalletConnected(true); // تنظیم پرچم اتصال

            try {
                await signer.provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await signer.provider.send('wallet_addEthereumChain', [
                        {
                            chainId: '0x61',
                            chainName: 'Binance Smart Chain Testnet',
                            rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
                            nativeCurrency: {
                                name: 'Binance Coin',
                                symbol: 'tBNB',
                                decimals: 18,
                            },
                            blockExplorerUrls: ['https://testnet.bscscan.com/'],
                        },
                    ]);
                } else {
                    throw switchError;
                }
            }

            toast.success('Wallet connected successfully!');
        } catch (error) {
            console.error('Error connecting wallet:', error);
            toast.error('Error connecting wallet: ' + (error.message || 'Unknown error'));
        }
    }, []);

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

    // فراخوانی اطلاعات بازیکن پس از اتصال کیف‌پول
    useEffect(() => {
        if (signer && fullAddress) {
            console.log(`Fetching player details for wallet: ${fullAddress}`);
            getPlayerDetails(fullAddress);
            fetchActivePlayers();
            fetchGameData();
        }
    }, [signer, fullAddress, getPlayerDetails, fetchActivePlayers, fetchGameData]);

    const joinGame = async () => {
        if (!signer) {
            toast.error('Please connect your wallet first.');
            return;
        }
        setLoading(true);
        try {
            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const tx = await contract.joinGame({ value: ethers.parseEther('0.004') });
            await tx.wait();
            await getPlayerDetails(fullAddress);
            await fetchActivePlayers();
            await fetchGameData();
            toast.success("Successfully joined the game!");
            setEvents(prevEvents => {
                const newEvents = [...prevEvents, "You joined the game!"];
                return newEvents.slice(-2);
            });
        } catch (error) {
            console.error("Transaction failed:", error);
            handleErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const rollDice = async () => {
        if (!signer) {
            toast.error('Please connect your wallet first.');
            return;
        }
        setLoading(true);
        setIsRolling(true);
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setIsRolling(false);
            toast.error("No response from the contract. Please try again.");
        }, 100000);
        try {
            const playerAddress = await signer.getAddress();
            const timestamp = Date.now();
            const seed = ethers.solidityPackedKeccak256(['address', 'uint256'], [playerAddress, timestamp]);
            const randomNumber = Number(ethers.toBigInt(seed) % ethers.toBigInt(6) + ethers.toBigInt(1));

            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const tx = await contract.rollDice(randomNumber);
            await tx.wait();

            await getPlayerDetails(playerAddress);
            await fetchActivePlayers();
            await fetchGameData();
            setDestination(playerInfo.position); // تنظیم destination برای انیمیشن
            toast.success("Dice rolled successfully!");
            setEvents(prevEvents => {
                const newEvents = [...prevEvents, "You rolled the dice!"];
                return newEvents.slice(-2);
            });
        } catch (error) {
            console.error("Transaction failed:", error);
            handleErrorMessage(error);
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
            setIsRolling(false);
        }
    };

    const buyAntidote = async () => {
        if (!signer) {
            toast.error('Please connect your wallet first.');
            return;
        }
        setLoading(true);
        try {
            const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
            const tx = await contract.buyAntidote({ value: ethers.parseEther('0.002') });
            await tx.wait();
            await getPlayerDetails(fullAddress);
            toast.success("Antidote purchased successfully!");
            setEvents(prevEvents => {
                const newEvents = [...prevEvents, "You purchased an antidote!"];
                return newEvents.slice(-2);
            });
        } catch (error) {
            console.error("Transaction failed:", error);
            handleErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const handleErrorMessage = (error) => {
        let errorMessage = "Unknown error.";
        if (error && error.data && error.data.message) {
            const reason = error.data.message.match(/"([^"]+)"/);
            if (reason && reason[1]) {
                switch (reason[1]) {
                    case "Contract is paused":
                        errorMessage = "The contract is currently paused.";
                        break;
                    case "Only EOA can call this function":
                        errorMessage = "Only externally owned accounts can call this function.";
                        break;
                    case "Invalid entry fee":
                        errorMessage = "The entry fee is invalid.";
                        break;
                    case "Max players":
                        errorMessage = "The maximum number of players has been reached.";
                        break;
                    case "Already active":
                        errorMessage = "You are already an active player.";
                        break;
                    case "Inactive player":
                        errorMessage = "You cannot roll the dice because you are inactive.";
                        break;
                    case "Already finished":
                        errorMessage = "The game has already finished.";
                        break;
                    case "Cannot move to that position":
                        errorMessage = "You cannot move with this dice number. Please roll the dice again later.";
                        break;
                    case "Invalid antidote fee":
                        errorMessage = "The antidote fee is invalid.";
                        break;
                    case "Max antidotes":
                        errorMessage = "You have reached the maximum number of antidotes.";
                        break;
                    case "No prize available":
                        errorMessage = "There is no prize available.";
                        break;
                    default:
                        errorMessage = reason[1] || "Unknown error.";
                }
            }
        } else if (error && error.reason) {
            errorMessage = error.reason;
        } else if (error && error.message) {
            errorMessage = error.message;
        }

        toast.error(errorMessage);
    };

    const calculateLifeTimePercentage = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsedTime = currentTime - playerInfo.lastActivityTime;
        const totalDuration = 24 * 60 * 60;
        const remainingTime = Math.max(totalDuration - elapsedTime, 0);
        return (remainingTime / totalDuration) * 100;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(donationAddress).then(() => {
            toast.success("Donation address copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy donation address.");
        });
    };

    return (
        <div className="app">
            <h1 className="neon-text" style={{ fontFamily: 'Barriecito-Regular', color: '#006400', textShadow: '0 0 10px #32CD32, 0 0 15px #32CD32, 0 0 20px #32CD32' }}>
                Snakes and Legend Frog
            </h1>
            <button onClick={() => setShowHowToPlay(true)} className="how-to-play-button" style={{ margin: '20px auto', display: 'flex', alignItems: 'center' }}>
                <img src={playIcon} alt="How to Play" className="how-to-play-icon" />
                <span style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>How to Play</span>
            </button>
            {!walletId ? (
                <WalletConnect onConnect={handleWalletConnect} className="wallet-connect-button" />
            ) : (
                <p className="neon-text" style={{ marginBottom: '20px', color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Wallet ID: {walletId}
                </p>
            )}
            <div className="prize-pool-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                <img src={prizeIcon} alt="Prize Pool" style={{ width: '100px', height: '120px', marginRight: '10px', marginTop: '-20px' }} />
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Frog Ribbit: {prizePool} tBNB
                </p>
            </div>
            <p className="neon-text" style={{ marginBottom: '20px', color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                Active Players: {activePlayers}
            </p>
            <GameBoard
                playerPosition={playerInfo.position}
                destination={destination}
                isWalletConnected={isWalletConnected}
            />
            <div className="player-info" style={{ fontFamily: 'CustomFont' }}>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Position: {playerInfo.position}
                </p>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Antidote: {playerInfo.antidoteCount > 0 ? playerInfo.antidoteCount : 0}
                </p>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Alive?: {playerInfo.isActive ? 'Yes' : 'No'}
                </p>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Rolled Dice: {playerInfo.diceRollCount !== undefined ? playerInfo.diceRollCount : 'N/A'}
                </p>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Last Dice: {playerInfo.lastDiceRoll !== undefined ? playerInfo.lastDiceRoll : 'N/A'}
                </p>
                <p className="neon-text" style={{ color: '#006400', textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32' }}>
                    Poisoned: {playerInfo.snakeEncounters}
                </p>
            </div>
            <div className="life-time-container">
                <label htmlFor="life-time">Life Time:</label>
                <div className="life-time-bar">
                    <div className="life-time-progress" style={{ width: `${calculateLifeTimePercentage()}%` }}></div>
                </div>
            </div>
            <div className="join-game-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button onClick={joinGame} disabled={loading} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={redFrogImage} alt="Join Game" style={{ width: '150px', height: '150px' }} />
                    <div className="tooltip" style={{ visibility: 'visible', width: '120px', backgroundColor: '', color: '#fff', textAlign: 'center', borderRadius: '5px', padding: '5px', position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                        Buy your Frog
                    </div>
                </button>
            </div>
            <div className="dice-container">
                <button onClick={rollDice} disabled={loading}>
                    <DiceAnimation
                        isRolling={isRolling}
                        lastDiceRoll={playerInfo.lastDiceRoll}
                        onRollComplete={(result) => {
                            console.log("Dice roll completed with result:", result);
                        }}
                    />
                </button>
            </div>
            <div className="buy-antidote-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                <button onClick={buyAntidote} disabled={loading} className="buy-antidote-button" style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '120px',
                    height: '100px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <img src={antidoteIcon} alt="Buy Antidote" style={{ width: '100%', height: '100%' }} />
                </button>
                <div className="tooltip" style={{
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
                    pointerEvents: 'none'
                }}>
                    Buy antidote for your frog!
                </div>
            </div>
            {showHowToPlay && (
                <HowToPlay onClose={() => setShowHowToPlay(false)} ref={howToPlayRef} />
            )}
            <div className="social-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <a href="https://www.instagram.com/cryptocurrency_dice_roll_bet?igsh=Zjl5d2tpN3QwNjF0" target="_blank" rel="noopener noreferrer" className="social-button">
                    <img src={instagramIcon} alt="Instagram" className="social-icon" />
                    <div className="tooltip">Instagram</div>
                </a>
                <a href="https://t.me/lottoariyabot" target="_blank" rel="noopener noreferrer" className="social-button">
                    <img src={telegramIcon} alt="Telegram" className="social-icon" />
                    <div className="tooltip">Telegram</div>
                </a>
                <a href="https://x.com/AriyaDice" target="_blank" rel="noopener noreferrer" className="social-button">
                    <img src={socialxIcon} alt="X" className="social-icon" />
                    <div className="tooltip">X</div>
                </a>
                <div className="donate-button" style={{ position: 'relative', marginLeft: '10px' }} onClick={copyToClipboard}>
                    <img src={heartIcon} alt="Donate" className="donate-icon" style={{ width: '30px', height: '30px', cursor: 'pointer' }} />
                    <div className="donate-tooltip">Enjoy the game? Buy me a Mosquito!</div>
                </div>
            </div>
            <div className="event-log">
                <h5>Event Log</h5>
                {events.map((event, index) => (
                    <p key={index}>{event}</p>
                ))}
            </div>
            {loading && (
                <div className="loading-container">
                    <img src={handGif} alt="Loading" className="loading-gif" />
                    <p className="loading-text">The frog goes ribbit.</p>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default App;
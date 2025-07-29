import { useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import DiceRollingGameABI from './SnakeGame.json';
import { toast } from 'react-toastify';

const contractAddress = '0xDa14e06ed17CEE5C0c3DD47D2ea172b884386789';

const ContractManager = ({
  signer,
  setSigner,
  fullAddress,
  setFullAddress,
  setWalletId,
  setIsWalletConnected,
  setPlayerInfo,
  setActivePlayers,
  setPrizePool,
  setEvents,
  setLoading,
  setIsRolling,
  setDestination,
  playerInfo,
  setContractActions,
  isWalletConnected,
}) => {
  const appendEventMessage = useCallback((msg) => {
    setEvents((prev) => [...prev, msg].slice(-2));
  }, [setEvents]);

  const handleErrorMessage = useCallback((error) => {
    let errorMessage = 'Unknown error.';
    if (error?.data?.message) {
      const reason = error.data.message.match(/"([^"]+)"/);
      if (reason?.[1]) {
        switch (reason[1]) {
          case 'Contract is paused':
            errorMessage = 'The contract is currently paused.'; break;
          case 'Only EOA can call this function':
            errorMessage = 'Only externally owned accounts can call this function.'; break;
          case 'Invalid entry fee':
            errorMessage = 'The entry fee is invalid.'; break;
          case 'Max players':
            errorMessage = 'The maximum number of players has been reached.'; break;
          case 'Already active':
            errorMessage = 'You are already an active player.'; break;
          case 'Inactive player':
            errorMessage = 'You cannot roll the dice because you are inactive.'; break;
          case 'Already finished':
            errorMessage = 'The game has already finished.'; break;
          case 'Cannot move to that position':
            errorMessage = 'You cannot move with this dice number. Please roll the dice again later.'; break;
          case 'Invalid antidote fee':
            errorMessage = 'The antidote fee is invalid.'; break;
          case 'Max antidotes':
            errorMessage = 'You have reached the maximum number of antidotes.'; break;
          case 'No prize available':
            errorMessage = 'There is no prize available.'; break;
          default:
            errorMessage = reason[1];
        }
      }
    } else if (error?.reason) {
      errorMessage = error.reason;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  }, []);

  const getPlayerDetails = useCallback(async (playerAddress) => {
    if (!signer || !playerAddress || !ethers.isAddress(playerAddress)) {
      console.log('Invalid signer or playerAddress:', { signer, playerAddress });
      if (isWalletConnected) toast.error('Invalid wallet address.');
      return;
    }
    try {
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
        snakeEncounters,
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

      setPlayerInfo(updatedPlayerInfo);
      setDestination(updatedPlayerInfo.position);
    } catch (error) {
      console.error('Failed to fetch player details:', error);
      toast.error(error.message.includes('network') ? 'Network error' : 'Failed to load player details.');
    }
  }, [signer, setPlayerInfo, setDestination, isWalletConnected]);

  const fetchActivePlayers = useCallback(async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const count = await contract.getActivePlayers();
      setActivePlayers(Number(count));
    } catch (error) {
      toast.error('Error fetching active players.');
    }
  }, [signer, setActivePlayers]);

  const fetchGameData = useCallback(async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const [fetchedPrizePool] = await contract.getPrizePoolAndWinners();
      const prizePoolValue = ethers.formatUnits(fetchedPrizePool, 18);
      setPrizePool(prizePoolValue);
    } catch (error) {
      toast.error('Failed to load game data.');
    }
  }, [signer, setPrizePool]);

  const handleWalletConnect = useCallback(async (account, signer) => {
    try {
      if (!account || !signer) throw new Error('Invalid account or signer');
      setSigner(signer);
      setWalletId(account.substring(0, 6));
      setFullAddress(account);
      setIsWalletConnected(true);

      const currentChainId = await signer.provider.send('eth_chainId', []);
      if (parseInt(currentChainId, 16) !== 97) {
        try {
          await signer.provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
        } catch (switchError) {
          if (switchError.code === 4902) {
            await signer.provider.send('wallet_addEthereumChain', [{
              chainId: '0x61',
              chainName: 'Binance Smart Chain Testnet',
              rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
              nativeCurrency: { name: 'Binance Coin', symbol: 'tBNB', decimals: 18 },
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            }]);
          } else {
            throw switchError;
          }
        }
      }

      toast.success('Wallet connected successfully!');
      if (ethers.isAddress(account)) {
        await getPlayerDetails(account);
        await fetchActivePlayers();
        await fetchGameData();
      }
    } catch (error) {
      toast.error('Error connecting wallet: ' + (error.message || 'Unknown error'));
      setIsWalletConnected(false);
      setSigner(null);
      setWalletId('');
      setFullAddress('');
    }
  }, [
    setSigner,
    setWalletId,
    setFullAddress,
    setIsWalletConnected,
    getPlayerDetails,
    fetchActivePlayers,
    fetchGameData
  ]);

  const joinGame = async () => {
    if (!signer) return toast.error('Please connect your wallet first.');
    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const tx = await contract.joinGame({ value: ethers.parseEther('0.004') });
      await tx.wait();
      await getPlayerDetails(fullAddress);
      await fetchActivePlayers();
      await fetchGameData();
      toast.success('Successfully joined the game!');
      appendEventMessage('You joined the game!');
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const rollDice = async () => {
    if (!signer) return toast.error('Please connect your wallet first.');
    setLoading(true);
    setIsRolling(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setIsRolling(false);
      toast.error('No response from the contract.');
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
      setDestination(playerInfo.position);
      toast.success('Dice rolled successfully!');
      appendEventMessage('You rolled the dice!');
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setIsRolling(false);
    }
  };

  const buyAntidote = async () => {
    if (!signer) return toast.error('Please connect your wallet first.');
    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const tx = await contract.buyAntidote({ value: ethers.parseEther('0.002') });
      await tx.wait();
      await getPlayerDetails(fullAddress);
      toast.success('Antidote purchased successfully!');
      appendEventMessage('You purchased an antidote!');
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setContractActions({
      joinGame,
      rollDice,
      buyAntidote,
      handleWalletConnect,
    });
  }, [setContractActions, joinGame, rollDice, buyAntidote, handleWalletConnect]);

  useEffect(() => {
    if (signer && fullAddress && ethers.isAddress(fullAddress)) {
      getPlayerDetails(fullAddress);
      fetchActivePlayers();
      fetchGameData();
    }
  }, [signer, fullAddress, getPlayerDetails, fetchActivePlayers, fetchGameData]);

  return null;
};

export default ContractManager;

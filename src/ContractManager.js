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
  const getPlayerDetails = useCallback(
    async (playerAddress) => {
      if (!signer || !playerAddress || !ethers.isAddress(playerAddress)) {
        console.log('Invalid signer or playerAddress:', { signer, playerAddress });
        // فقط در صورتی Toast نمایش داده شود که اتصال کیف پول برقرار باشد
        if (isWalletConnected) {
          toast.error('Invalid wallet address.');
        }
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

        console.log('Player details fetched:', updatedPlayerInfo);
        setPlayerInfo(updatedPlayerInfo);
        setDestination(updatedPlayerInfo.position);
      } catch (error) {
        console.error('Failed to fetch player details:', error);
        toast.error(error.message.includes('network') ? 'Network error' : 'Failed to load player details.');
      }
    },
    [signer, setPlayerInfo, setDestination, isWalletConnected]
  );

  const fetchActivePlayers = useCallback(async () => {
    if (!signer) {
      console.log('No signer available for fetchActivePlayers');
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const count = await contract.getActivePlayers();
      setActivePlayers(Number(count));
      console.log(`Active players: ${count}`);
    } catch (error) {
      console.error('Failed to fetch active players:', error);
      toast.error('Error fetching active players.');
    }
  }, [signer, setActivePlayers]);

  const fetchGameData = useCallback(async () => {
    if (!signer) {
      console.log('No signer available for fetchGameData');
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const [fetchedPrizePool] = await contract.getPrizePoolAndWinners();
      const prizePoolValue = ethers.formatUnits(fetchedPrizePool, 18);
      setPrizePool(prizePoolValue);
      console.log(`Prize pool: ${prizePoolValue} tBNB`);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      toast.error('Failed to load game data.');
    }
  }, [signer, setPrizePool]);

  const handleWalletConnect = useCallback(
    async (account, signer) => {
      console.log('handleWalletConnect called with:', { account, signer });
      try {
        if (!account || !signer) {
          throw new Error('Invalid account or signer');
        }
        setSigner(signer);
        setWalletId(account.substring(0, 6));
        setFullAddress(account);
        setIsWalletConnected(true);

        console.log('Signer set successfully:', signer);
        try {
          const currentChainId = await signer.provider.send('eth_chainId', []);
          console.log('Current chain ID:', currentChainId);
          if (currentChainId !== '0x61') {
            await signer.provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
            console.log('Switched to BSC Testnet');
          }
        } catch (switchError) {
          if (switchError.code === 4902) {
            await signer.provider.send('wallet_addEthereumChain', [
              {
                chainId: '0x61',
                chainName: 'Binance Smart Chain Testnet',
                rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
                nativeCurrency: { name: 'Binance Coin', symbol: 'tBNB', decimals: 18 },
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              },
            ]);
            console.log('Added BSC Testnet');
          } else {
            throw switchError;
          }
        }

        toast.success('Wallet connected successfully!');
        // فراخوانی اولیه برای دریافت اطلاعات بازیکن
        if (ethers.isAddress(account)) {
          await getPlayerDetails(account);
          await fetchActivePlayers();
          await fetchGameData();
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Error connecting wallet: ' + (error.message || 'Unknown error'));
        setIsWalletConnected(false);
        setSigner(null);
        setWalletId('');
        setFullAddress('');
      }
    },
    [setSigner, setWalletId, setFullAddress, setIsWalletConnected, getPlayerDetails, fetchActivePlayers, fetchGameData]
  );

  const joinGame = async () => {
    if (!signer) {
      console.log('No signer available for joinGame', { signer, isWalletConnected });
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
      toast.success('Successfully joined the game!');
      setEvents((prev) => [...prev, 'You joined the game!'].slice(-2));
    } catch (error) {
      console.error('Transaction failed:', error);
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const rollDice = async () => {
    if (!signer) {
      console.log('No signer available for rollDice', { signer, isWalletConnected });
      toast.error('Please connect your wallet first.');
      return;
    }
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
      setEvents((prev) => [...prev, 'You rolled the dice!'].slice(-2));
    } catch (error) {
      console.error('Transaction failed:', error);
      handleErrorMessage(error);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setIsRolling(false);
    }
  };

  const buyAntidote = async () => {
    if (!signer) {
      console.log('No signer available for buyAntidote', { signer, isWalletConnected });
      toast.error('Please connect your wallet first.');
      return;
    }
    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const tx = await contract.buyAntidote({ value: ethers.parseEther('0.002') });
      await tx.wait();
      await getPlayerDetails(fullAddress);
      toast.success('Antidote purchased successfully!');
      setEvents((prev) => [...prev, 'You purchased an antidote!'].slice(-2));
    } catch (error) {
      console.error('Transaction failed:', error);
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorMessage = (error) => {
    let errorMessage = 'Unknown error.';
    if (error && error.data && error.data.message) {
      const reason = error.data.message.match(/"([^"]+)"/);
      if (reason && reason[1]) {
        switch (reason[1]) {
          case 'Contract is paused':
            errorMessage = 'The contract is currently paused.';
            break;
          case 'Only EOA can call this function':
            errorMessage = 'Only externally owned accounts can call this function.';
            break;
          case 'Invalid entry fee':
            errorMessage = 'The entry fee is invalid.';
            break;
          case 'Max players':
            errorMessage = 'The maximum number of players has been reached.';
            break;
          case 'Already active':
            errorMessage = 'You are already an active player.';
            break;
          case 'Inactive player':
            errorMessage = 'You cannot roll the dice because you are inactive.';
            break;
          case 'Already finished':
            errorMessage = 'The game has already finished.';
            break;
          case 'Cannot move to that position':
            errorMessage = 'You cannot move with this dice number. Please roll the dice again later.';
            break;
          case 'Invalid antidote fee':
            errorMessage = 'The antidote fee is invalid.';
            break;
          case 'Max antidotes':
            errorMessage = 'You have reached the maximum number of antidotes.';
            break;
          case 'No prize available':
            errorMessage = 'There is no prize available.';
            break;
          default:
            errorMessage = reason[1] || 'Unknown error.';
        }
      }
    } else if (error && error.reason) {
      errorMessage = error.reason;
    } else if (error && error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  // انتقال توابع عملیاتی به App
  useEffect(() => {
    setContractActions({
      joinGame,
      rollDice,
      buyAntidote,
      handleWalletConnect,
    });
    console.log('Contract actions set:', { joinGame, rollDice, buyAntidote, handleWalletConnect });
  }, [setContractActions, handleWalletConnect]);

  useEffect(() => {
    if (signer && fullAddress && ethers.isAddress(fullAddress)) {
      console.log(`Fetching player details for wallet: ${fullAddress}`);
      getPlayerDetails(fullAddress);
      fetchActivePlayers();
      fetchGameData();
    } else {
      console.log('Signer or valid fullAddress missing:', { signer, fullAddress });
    }
  }, [signer, fullAddress, getPlayerDetails, fetchActivePlayers, fetchGameData]);

  return null;
};

export default ContractManager;
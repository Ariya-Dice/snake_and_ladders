import React, { useState, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const PROJECT_DETAILS = {
  projectId: '2c04f004aaadf779b405f70334343adc',
  name: 'Snake and Ladders',
  description: 'Snake and Ladders in Blockchain',
  link: 'https://www.lottoariya.xyz',
};

const WalletConnect = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleError = useCallback((error) => {
    let errorMessage = 'Failed to connect to wallet';
    if (error?.code === 4001) {
      errorMessage = 'You rejected the connection request';
    } else if (error?.code === -32002) {
      errorMessage = 'A connection request is already pending';
    } else if (error?.message?.includes('No provider found')) {
      errorMessage = 'No wallet detected. Please install a compatible wallet like MetaMask or Trust Wallet.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    setError(errorMessage);
    console.error('Connection Error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
    });
    setConnecting(false);
  }, []);

  const handleSuccess = useCallback(async (account, provider) => {
    try {
      setAccount(account);
      const signer = await provider.getSigner();
      await onConnect(account, signer);
    } catch (error) {
      handleError(error);
    } finally {
      setConnecting(false);
    }
  }, [onConnect, handleError]);

  const connectWallet = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider.isMetaMask) {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        await handleSuccess(accounts[0], ethersProvider);
        return;
      }

      const wcProvider = await EthereumProvider.init({
        projectId: PROJECT_DETAILS.projectId,
        chains: [97], // BSC Testnet
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: PROJECT_DETAILS.name,
          description: PROJECT_DETAILS.description,
          url: PROJECT_DETAILS.link,
          icons: ['https://www.lottoariya.xyz/favicon.ico'],
        },
      });

      await wcProvider.connect();
      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      await handleSuccess(address, ethersProvider);
    } catch (error) {
      handleError(error);
    }
  }, [handleSuccess, handleError]);

  return (
    <div>
      <button
        onClick={connectWallet}
        className="wallet-connect-button"
        disabled={connecting}
      >
        {account
          ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : connecting
            ? 'Connecting...'
            : 'Connect Wallet'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;

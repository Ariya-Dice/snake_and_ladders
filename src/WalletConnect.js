import React, { useState, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const WalletConnect = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const projectDetails = {
    projectId: '2c04f004aaadf779b405f70334343adc',
    name: 'Snake and Ladders',
    description: 'Snake and Ladders in Blockchain',
    link: 'https://www.lottoariya.xyz',
  };

  const handleSuccess = async (account, provider) => {
    console.log('handleSuccess called with account:', account);
    try {
      setAccount(account);
      const signer = await provider.getSigner();
      console.log('Signer created:', signer);
      await onConnect(account, signer);
      console.log('onConnect called successfully');
    } catch (error) {
      console.error('Error in handleSuccess:', error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = 'Failed to connect to wallet';
    if (error.code === 4001) {
      errorMessage = 'You rejected the connection request';
    } else if (error.code === -32002) {
      errorMessage = 'A connection request is already pending';
    } else if (error.message.includes('No provider found')) {
      errorMessage = 'No wallet detected. Please install a compatible wallet like MetaMask or Trust Wallet.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }
    setError(errorMessage);
    console.error('Connection Error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
  };

  const connectWallet = async () => {
    setError(null);
    console.log('connectWallet called');
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider.isMetaMask) {
        console.log('MetaMask detected');
        const ethersProvider = new ethers.BrowserProvider(provider);
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        await handleSuccess(accounts[0], ethersProvider);
        return;
      }

      console.log('Using WalletConnect');
      const wcProvider = await EthereumProvider.init({
        projectId: projectDetails.projectId,
        chains: [97],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: projectDetails.name,
          description: projectDetails.description,
          url: projectDetails.link,
          icons: ['https://www.lottoariya.xyz/favicon.ico'],
        },
      });

      await wcProvider.connect();
      console.log('WalletConnect connected');
      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      await handleSuccess(address, ethersProvider);
    } catch (error) {
      console.error('Error in connectWallet:', error);
      handleError(error);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        className="wallet-connect-button"
      >
        {account
          ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : 'Connect Wallet'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;
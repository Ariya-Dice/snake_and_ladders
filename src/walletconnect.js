import React, { useState, useEffect, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';

const WalletConnectButton = ({ onConnect }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAndroid = /android/i.test(navigator.userAgent);

    // Define deep links and download links for wallets
    const walletDeepLinks = {
        trust: {
            deeplink: 'trust://wc?uri=',
            universal: 'https://link.trustwallet.com/wc?uri=',
            download: 'https://trustwallet.com/download'
        },
        metamask: {
            deeplink: 'metamask://wc?uri=',
            universal: 'https://metamask.app.link/wc?uri=',
            download: 'https://metamask.io/download/'
        },
        coinbase: {
            deeplink: 'cbwallet://wc?uri=',
            universal: 'https://go.cb-w.com/wc?uri=',
            download: 'https://www.coinbase.com/wallet/downloads'
        },
        safepal: {
            deeplink: 'safepalwallet://wc?uri=',
            universal: 'https://www.safepal.com/download',
            download: 'https://www.safepal.com/download'
        }
    };

    // Check if the deep link is available for the wallet
    const checkDeeplinkAvailability = async (wallet) => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = wallet.deeplink;

            const timeout = setTimeout(() => {
                alert(`Wallet not detected. Redirecting to ${wallet.universal}`);
                window.location.href = wallet.download; // Redirect to download page if not installed
                resolve(false);
            }, 500);

            iframe.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };

            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 1000);
        });
    };

    // Check installed wallets
    const checkInstalledWallets = async (links) => {
        try {
            for (const [walletName, info] of Object.entries(links)) {
                console.log(`Checking wallet: ${walletName}`);
                const isInstalled = await checkDeeplinkAvailability(info);
                if (isInstalled) return info.deeplink;
            }
            return null;
        } catch (error) {
            console.error('Error checking wallets:', error);
            return null;
        }
    };

    // Handle successful connection
    const handleSuccess = async (account, provider) => {
        setAccount(account);
        const signer = await provider.getSigner();
        onConnect(account, signer); // Pass account and signer to onConnect
    };

    // Handle errors with improved messages
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
            stack: error.stack
        });
    };

    // Function to connect to wallet
    const connectWallet = async () => {
        setLoading(true);
        setError(null);

        try {
            // First, try to connect to MetaMask
            const provider = await detectEthereumProvider();
            if (provider && provider.isMetaMask) {
                const ethersProvider = new ethers.BrowserProvider(provider);
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                await handleSuccess(accounts[0], ethersProvider);
                return;
            }

            // Otherwise, use WalletConnect
            const walletConnectProvider = new WalletConnectProvider({
                rpc: {
                    97: 'https://bsc-testnet-rpc.publicnode.com', // For BSC Testnet
                },
                chainId: 97, // chainId for BSC Testnet
                qrcode: true,
                qrcodeModalOptions: {
                    mobileLinks: ['metamask', 'trust', 'coinbase', 'safepal'],
                },
            });

            await walletConnectProvider.enable();
            const ethersProvider = new ethers.BrowserProvider(walletConnectProvider);
            const accounts = await ethersProvider.listAccounts();
            await handleSuccess(accounts[0].address, ethersProvider);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={connectWallet}
                disabled={loading}
                className="wallet-connect-button"
            >
                {loading
                    ? 'Connecting...'
                    : account
                    ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                    : 'Connect Wallet'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WalletConnectButton;
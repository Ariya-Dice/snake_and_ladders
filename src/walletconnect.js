import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

const WalletConnectButton = ({ onConnect }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connector, setConnector] = useState(null);

    const isAndroid = /android/i.test(navigator.userAgent);

    const walletDeepLinks = {
        trust: {
            deeplink: 'trust://browse?action=connect&url=' + encodeURIComponent(window.location.href),
            universal: 'https://link.trustwallet.com/open_url?url=' + encodeURIComponent(window.location.href)
        },
        metamask: {
            deeplink: 'metamask://dapp?url=' + encodeURIComponent(window.location.href),
            universal: 'https://metamask.app.link/dapp/' + window.location.host
        },
        coinbase: {
            deeplink: 'coinbase-wallet://',
            universal: 'https://go.cb-w.com/'
        },
        safepal: {
            deeplink: 'safepal://',
            universal: 'https://safepal.io/'
        }
    };

    // Check if the wallet is available using Deeplink
    const checkDeeplinkAvailability = async (wallet) => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = wallet.deeplink;

            const timeout = setTimeout(() => {
                window.location.href = wallet.universal;
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

    // Check if any wallets are installed
    const checkInstalledWallets = async (links) => {
        try {
            for (const [wallet, info] of Object.entries(links)) {
                const isInstalled = await checkDeeplinkAvailability(info);
                if (isInstalled) return info.deeplink;
            }
            return null;
        } catch (error) {
            console.error('Error checking wallets:', error);
            return null;
        }
    };

    // Connect to the wallet
    const connectWallet = async () => {
        setLoading(true);
        setError(null);

        try {
            const provider = await detectEthereumProvider();
            if (provider) {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                handleSuccess(accounts[0]);
                return;
            }

            if (isAndroid) {
                const installedWallet = await checkInstalledWallets(walletDeepLinks);
                
                if (installedWallet) {
                    window.location.href = installedWallet;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    initWalletConnect();
                } else {
                    initWalletConnect();
                    QRCodeModal.open();
                }
            } else {
                initWalletConnect();
                QRCodeModal.open();
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize WalletConnect
    const initWalletConnect = () => {
        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org',
            qrcodeModal: QRCodeModal,
            clientMeta: {
                description: 'Ariya Snake & Ladder Game',
                url: window.location.href,
                icons: ['https://your-dapp-logo.png'],
                name: 'Ariya Dice Game'
            }
        });

        connector.on('connect', (error, payload) => {
            if (error) {
                handleError(error);
                return;
            }
            handleWalletConnectSession(connector);
        });

        connector.on('session_update', (error, payload) => {
            if (error) {
                handleError(error);
                return;
            }
            handleWalletConnectSession(connector);
        });

        connector.on('disconnect', (error) => {
            if (error) {
                handleError(error);
                return;
            }
            setAccount(null);
        });

        setConnector(connector);
    };

    // Handle WalletConnect session
    const handleWalletConnectSession = (connector) => {
        const { accounts } = connector;
        if (accounts && accounts.length > 0) {
            handleSuccess(accounts[0]);
        }
    };

    const handleSuccess = (account) => {
        setAccount(account);
        onConnect(account);
    };

    const handleError = (error) => {
        let errorMessage = 'Connection failed';
        
        if (error.code === 4001) {
            errorMessage = 'User rejected the request';
        } else if (error.code === -32002) {
            errorMessage = 'Already processing request';
        } else if (error.message.includes('No provider found')) {
            errorMessage = 'No wallet detected';
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

    useEffect(() => {
        if (connector) {
            connector.on('connect', (error, payload) => {
                if (error) {
                    handleError(error);
                    return;
                }
                handleWalletConnectSession(connector);
            });

            connector.on('session_update', (error, payload) => {
                if (error) {
                    handleError(error);
                    return;
                }
                handleWalletConnectSession(connector);
            });

            connector.on('disconnect', (error) => {
                if (error) {
                    handleError(error);
                    return;
                }
                setAccount(null);
            });
        }
    }, [connector]);

    return (
        <div>
            <button 
                onClick={connectWallet} 
                disabled={loading}
                className="wallet-connect-button"
            >
                {loading ? 'Connecting...' : account ? `Connected: ${account}` : 'Connect Wallet'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WalletConnectButton;
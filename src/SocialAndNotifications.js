// src/SocialAndNotifications.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instagramIcon from './pic/instagram.png';
import telegramIcon from './pic/telegram.png';
import socialxIcon from './pic/socialx.png';
import heartIcon from './pic/redforg.svg';
import handGif from './pic/hand.gif';

const donationAddress = '0xC776f5fDB11eC7897cbc18a4005390eb1D7DeC62';

const SocialAndNotifications = ({ events, loading }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(donationAddress)
      .then(() => toast.success('Donation address copied to clipboard!'))
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy donation address.');
      });
  };

  return (
    <>
      <div
        className="social-buttons"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}
      >
        <a
          href="https://www.instagram.com/cryptocurrency_dice_roll_bet?igsh=Zjl5d2tpN3QwNjF0"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button"
        >
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
          <div className="tooltip">Instagram</div>
        </a>
        <a
          href="https://t.me/lottoariyabot"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button"
        >
          <img src={telegramIcon} alt="Telegram" className="social-icon" />
          <div className="tooltip">Telegram</div>
        </a>
        <a
          href="https://x.com/AriyaDice"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button"
        >
          <img src={socialxIcon} alt="X" className="social-icon" />
          <div className="tooltip">X</div>
        </a>
        <div
          className="donate-button"
          style={{ position: 'relative', marginLeft: '10px' }}
          onClick={copyToClipboard}
        >
          <img
            src={heartIcon}
            alt="Donate"
            className="donate-icon"
            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
          />
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
    </>
  );
};

export default SocialAndNotifications;
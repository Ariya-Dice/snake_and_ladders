// src/IntroDialog.js
import React, { useState, useEffect, useRef } from 'react';
import './IntroDialog.css';
import yesIcon from './pic/yes.svg';
import noIcon from './pic/no.svg';
import thinkIcon from './pic/think.gif';
import okIcon from './pic/ok2.gif';

const IntroDialog = ({ onYesClick, onNoClick, isWalletConnected }) => {
  const [dialogText, setDialogText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponseButtons, setShowResponseButtons] = useState(false);
  const [isDialogClosed, setIsDialogClosed] = useState(false);
  const [resetDialog, setResetDialog] = useState(0); // برای تحریک انیمیشن دیالوگ اولیه
  const typingTimerRef = useRef(null); // برای ذخیره تایمر تایپ

  // متن دیالوگ اولیه
  const initialDialog =
    "Hey, can you help me get to my family? I promise if you help me, I'll give you some of my wife's jewels when I get there...";

  // متن پاسخ برای انتخاب "بله"
  const yesResponse = `I'm so happy! You just need to cover our travel costs! Don't worry, I promise to pay you back many times over when we get there! 
  Now, install a digital wallet like MetaMask or Trust Wallet. Get some TBNB from this address. For now, our path goes through the BNB Testnet. 
  Then come back, and we'll hit the road. I recommend buying an antidote too, because there are poisonous snakes along the way. 
  If you get me to my family, I'll give you jewels like you've never seen... Let's go!`;

  // متن پاسخ برای انتخاب "خیر"
  const noResponse = `Oh, proud human! You don't know what you're missing: my wife's jewel prize! Friendship with a wise frog! An exciting journey! Helping a passionate game developer... 
  You're missing all of this... Think again!`;

  // افکت تایپ برای دیالوگ اولیه
  useEffect(() => {
    if (isWalletConnected || isDialogClosed) return;

    let index = 0;
    setDialogText('');
    setShowButtons(false); // اطمینان از مخفی بودن دکمه‌ها در شروع
    typingTimerRef.current = setInterval(() => {
      if (index < initialDialog.length) {
        setDialogText((prev) => prev + (initialDialog[index] || ''));
        index++;
      } else {
        clearInterval(typingTimerRef.current);
        setShowButtons(true);
      }
    }, 50);

    return () => clearInterval(typingTimerRef.current);
  }, [isWalletConnected, isDialogClosed, resetDialog]); // resetDialog به وابستگی‌ها اضافه شد

  // افکت تایپ برای متن پاسخ
  useEffect(() => {
    if (!showResponse) return;

    let index = 0;
    const response = showResponse === 'yes' ? yesResponse : noResponse;
    setResponseText('');
    setShowResponseButtons(false); // اطمینان از مخفی بودن دکمه‌ها در شروع
    typingTimerRef.current = setInterval(() => {
      if (index < response.length) {
        setResponseText((prev) => prev + (response[index] || ''));
        index++;
      } else {
        clearInterval(typingTimerRef.current);
        setShowResponseButtons(true);
      }
    }, 50);

    return () => clearInterval(typingTimerRef.current);
  }, [showResponse]);

  // هندل کلیک برای توقف انیمیشن و نمایش فوری متن
  const handleDialogClick = () => {
    if (!showResponse && dialogText !== initialDialog) {
      // توقف انیمیشن دیالوگ اولیه
      clearInterval(typingTimerRef.current);
      setDialogText(initialDialog);
      setShowButtons(true);
    } else if (showResponse && responseText !== (showResponse === 'yes' ? yesResponse : noResponse)) {
      // توقف انیمیشن پاسخ
      clearInterval(typingTimerRef.current);
      setResponseText(showResponse === 'yes' ? yesResponse : noResponse);
      setShowResponseButtons(true);
    }
  };

  const handleYes = () => {
    setDialogText('');
    setShowButtons(false);
    setShowResponse('yes');
    onYesClick();
  };

  const handleNo = () => {
    setDialogText('');
    setShowButtons(false);
    setShowResponse('no');
    onNoClick();
  };

  const handleOk = () => {
    setIsDialogClosed(true);
  };

  const handleRetry = () => {
    setShowResponse(false);
    setResponseText('');
    setShowResponseButtons(false);
    setDialogText('');
    setResetDialog((prev) => prev + 1); // تحریک useEffect برای انیمیشن دیالوگ اولیه
  };

  if (isWalletConnected || isDialogClosed) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" onClick={handleDialogClick}>
        {dialogText && !showResponse && <p className="dialog-text">{dialogText}</p>}
        {showResponse && <p className="dialog-text">{responseText}</p>}
        {showButtons && (
          <div className="dialog-buttons">
            <button className="dialog-button yes-button" onClick={handleYes}>
              <img src={yesIcon} alt="Yes" className="dialog-icon" />
            </button>
            <button className="dialog-button no-button" onClick={handleNo}>
              <img src={noIcon} alt="No" className="dialog-icon" />
            </button>
          </div>
        )}
        {showResponseButtons && showResponse === 'yes' && (
          <div className="dialog-buttons">
            <button className="dialog-button ok-button" onClick={handleOk}>
              <img src={okIcon} alt="OK" className="dialog-icon" />
            </button>
          </div>
        )}
        {showResponseButtons && showResponse === 'no' && (
          <div className="dialog-buttons">
            <button className="dialog-button retry-button" onClick={handleRetry}>
              <img src={thinkIcon} alt="Rethink" className="dialog-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroDialog;
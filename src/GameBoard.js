// src/GameBoard.js
import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import playerMarker from './pic/redfrog.svg';

const rows = 10;
const columns = 10;

// کامپوننت Square
const Square = React.memo(({ position, playerPosition, scale }) => {
    const isPlayerHere = playerPosition === position;
    if (isPlayerHere) {
        console.log(`Rendering frog at position ${position}, scale: ${scale}`);
    }
    return (
        <div className="square">
            {isPlayerHere && (
                <img
                    src={playerMarker}
                    alt={`قورباغه در موقعیت ${position}`}
                    className="player-image"
                    style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
                    onError={() => console.error(`Failed to load image at position ${position}`)}
                />
            )}
            <span className="square-number">{position}</span>
        </div>
    );
});

// کامپوننت GameBoard
const GameBoard = ({ playerPosition, destination, isWalletConnected }) => {
    const [currentPosition, setCurrentPosition] = useState(1); // موقعیت اولیه: خانه 1
    const [animating, setAnimating] = useState(false);
    const [scale, setScale] = useState(1);
    const [initialConnection, setInitialConnection] = useState(true); // پرچم برای اتصال اولیه

    // مدیریت موقعیت اولیه و انتقال بدون انیمیشن پس از اتصال کیف‌پول
    useEffect(() => {
        if (isWalletConnected && initialConnection && playerPosition !== currentPosition) {
            console.log(`Moving frog to initial position ${playerPosition} without animation`);
            setCurrentPosition(playerPosition);
            setInitialConnection(false); // غیرفعال کردن پرچم پس از اتصال اولیه
        }
    }, [isWalletConnected, playerPosition, initialConnection]);

    // اجرای انیمیشن برای تغییرات موقعیت (پس از پرتاب تاس)
    useEffect(() => {
        console.log(`playerPosition: ${playerPosition}, destination: ${destination}, animating: ${animating}, initialConnection: ${initialConnection}`);
        if (!initialConnection && playerPosition !== destination && !animating) {
            console.log(`Starting animation from ${currentPosition} to ${destination}`);
            setAnimating(true);
            animateMove(currentPosition, destination);
        }
    }, [playerPosition, destination, animating, currentPosition, initialConnection]);

    // تابع انیمیشن
    const animateMove = (start, end) => {
        const startTime = performance.now();
        const distance = Math.abs(end - start);
        const duration = distance * 500; // 500 میلی‌ثانیه به ازای هر خانه

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // محاسبه موقعیت فعلی
            const currentPos = Math.round(start + (end - start) * progress);

            // محاسبه مقیاس برای افکت جهش
            const midpoint = duration / 2;
            let currentScale;
            if (elapsed < midpoint) {
                currentScale = 1 + 0.5 * (elapsed / midpoint); // از 1 به 1.5
            } else {
                currentScale = 1.5 - 0.5 * ((elapsed - midpoint) / midpoint); // از 1.5 به 1
            }

            setCurrentPosition(currentPos);
            setScale(currentScale);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setAnimating(false);
                setCurrentPosition(end);
                setScale(1);
                console.log(`Animation ended at position ${end}`);
            }
        };

        requestAnimationFrame(animate);
    };

    // رندر ردیف‌ها
    const renderRow = (row) => {
        return [...Array(columns)].map((_, col) => {
            // شماره‌گذاری برای هماهنگی با تصویر پس‌زمینه
            const visualRow = rows - 1 - row; // ردیف 9 = پایین، ردیف 0 = بالا
            const basePosition = (rows - 1 - visualRow) * columns; // ردیف 9 = 0, ردیف 0 = 90
            const position = basePosition + (visualRow % 2 === 0 ? columns - col : col + 1);
            console.log(`Row ${visualRow}, Col ${col}, Position ${position}`); // لاگ برای دیباگ
            return (
                <Square
                    key={position}
                    position={position}
                    playerPosition={currentPosition}
                    scale={scale}
                />
            );
        });
    };

    return (
        <div className="board">
            {[...Array(rows)].map((_, row) => (
                <React.Fragment key={row}>{renderRow(rows - 1 - row)}</React.Fragment> // رندر از ردیف 9 (پایین) تا 0 (بالا)
            ))}
        </div>
    );
};

export default React.memo(GameBoard);
// src/GameBoard.js
import React from 'react';
import './GameBoard.css'; // Import CSS file for styling
import playerMarker from './pic/redfrog.svg'; // Image for player marker

const rows = 10;
const columns = 10;

// Optimized Cell Component with React.memo
const Square = React.memo(({ position, playerPosition }) => {
    const isPlayerHere = playerPosition === position; // Check if the player is at this position
    return (
        <div className="square">
            {isPlayerHere && (
                <img 
                    src={playerMarker} 
                    alt={`Player marker at position ${position}`} 
                    className="player-image" 
                />
            )}
            <span className="square-number">{position}</span> {/* Display the position number */}
        </div>
    );
});

// GameBoard Component
const GameBoard = ({ playerPosition }) => {
    const renderRow = (row) => {
        return [...Array(columns)].map((_, col) => {
            // Calculate position based on row and column
            const position = row * columns + (row % 2 === 0 ? col : (columns - 1 - col)) + 1;
            return <Square key={position} position={position} playerPosition={playerPosition} />;
        });
    };

    return (
        <div className="board">
            {[...Array(rows)].map((_, row) => (
                <React.Fragment key={row}>
                    {renderRow(rows - 1 - row)} {/* Render rows from bottom to top */}
                </React.Fragment>
            ))}
        </div>
    );
};

export default React.memo(GameBoard); // Use React.memo for optimization
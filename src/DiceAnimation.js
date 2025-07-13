import React, { useEffect, useRef, useState } from 'react';
import './DiceAnimation.css'; // Import the CSS styles for the dice animation

const DiceAnimation = ({ onRollComplete, isRolling, lastDiceRoll }) => {
    const diceRef = useRef(null);
    const outputDivRef = useRef(null);
    const [diceValue, setDiceValue] = useState(lastDiceRoll); // Initialize with lastDiceRoll

    useEffect(() => {
        if (isRolling) {
            const interval = setInterval(() => {
                const randomSide = Math.floor(Math.random() * 6) + 1; // Generate random number between 1 and 6
                setDiceValue(randomSide); // Set the dice side
            }, 300); // Change dice side every 300 milliseconds

            return () => clearInterval(interval); // Clear interval on unmount
        } else {
            // When rolling stops, show the final number
            setDiceValue(lastDiceRoll); // Set the final dice value to lastDiceRoll
            outputDivRef.current.classList.remove("hide");
            outputDivRef.current.classList.add("reveal");
            // Call the onRollComplete callback with the lastDiceRoll value
            onRollComplete(lastDiceRoll);
        }
    }, [isRolling, lastDiceRoll]);

    return (
        <div className="dice-container">
            <div id="dice" ref={diceRef}>
                <div className="sides side-1"><span className="dice-symbol">{diceValue}</span></div>
                <div className="sides side-2"><span className="dice-symbol">{diceValue}</span></div>
                <div className="sides side-3"><span className="dice-symbol">{diceValue}</span></div>
                <div className="sides side-4"><span className="dice-symbol">{diceValue}</span></div>
                <div className="sides side-5"><span className="dice-symbol">{diceValue}</span></div>
                <div className="sides side-6"><span className="dice-symbol">{diceValue}</span></div>
            </div>
            <div id="diceResult" ref={outputDivRef} className="hide">{diceValue}</div> {/* Show final result */}
        </div>
    );
};

export default DiceAnimation;
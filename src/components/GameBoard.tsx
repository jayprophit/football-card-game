import React from 'react';

const GameBoard = ({ gameBoard, selectedCard, handleCardSelection, moveCard }) => (
  <div className="grid grid-cols-8 gap-1">
    {gameBoard.map((row, rowIndex) => 
      row.map((cell, colIndex) => (
        <div 
          key={`${rowIndex}-${colIndex}`}
          className={`
            w-12 h-12 border 
            ${rowIndex < 4 ? 'bg-blue-100' : 
              rowIndex < 8 ? 'bg-green-100' : 
              rowIndex < 12 ? 'bg-yellow-100' : 'bg-red-100'}
            flex items-center justify-center
            cursor-pointer
            hover:bg-opacity-50
          `}
          onClick={() => cell 
            ? handleCardSelection(cell, rowIndex, colIndex)
            : selectedCard 
              ? moveCard(selectedCard, rowIndex, colIndex)
              : null
          }
        >
          {cell && (
            <div 
              className={`
                w-10 h-10 rounded-full 
                flex items-center justify-center
                text-white text-xs
              `}
              style={{ backgroundColor: cell.color }}
            >
              {cell.name.charAt(0)}
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

export default GameBoard;

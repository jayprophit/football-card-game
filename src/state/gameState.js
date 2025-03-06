const initialState = {
  squares: Array(9).fill(null),
  players: [
    { name: 'Player 1', position: 'Forward', team: 'Team A', image: null },
    { name: 'Player 2', position: 'Defender', team: 'Team B', image: null }
  ],
  currentPlayer: 0,
  gameStarted: false
};

const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true
      };
    case 'RESET_GAME':
      return initialState;
    case 'MAKE_MOVE':
      const newSquares = state.squares.slice();
      newSquares[action.index] = state.currentPlayer === 0 ? 'X' : 'O';
      return {
        ...state,
        squares: newSquares,
        currentPlayer: (state.currentPlayer + 1) % 2
      };
    default:
      return state;
  }
};

export default gameStateReducer;
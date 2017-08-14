function generateMessage(text: string) {
  return (player: string) => `${player}: ${text}`;
}

export const putPawnMessage = generateMessage('put pawn on the board');
export const removePawnMessage = generateMessage('remove opponent pawn from the board');
export const selectPawnMessage = generateMessage('select pawn to move');
export const movePawnMessage = generateMessage('move pawn to highlighted box');
export const setWinnerMessage = generateMessage('the winner');

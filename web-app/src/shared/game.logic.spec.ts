import { gameLogic } from './game.logic';
import { Board, generateBoard } from './board.generator';
import { GameState, PLAYER1, PLAYER2, PUT_ACTION } from './game.helpers';
import { putPawnMessage } from './game.messages';
import { gameReducer } from './game.reducer';

interface AppState {
  game: GameState;
}
const player1Name = "Player 1";
const player2Name = "Player 2";
let returnedActions: any;
let returnedState: any;

interface PawnsInterface {
  PLAYER1: {
    pawnsInHand: number,
    pawnsOnBoard: number,
  },
  PLAYER2: {
    pawnsInHand: number,
    pawnsOnBoard: number,
  }
}

function testGameLogic(
  message: string,
  initialBoard: Board,
  expectedBoard: Board,
  action: string,
  actionAfter: string,
  currentPlayer: string,
  nextPlayer: string,
  row: number,
  column: number,
  initialMessage: string,
  expectedMessage: string,
  initialPawns: PawnsInterface,
  expectedPawns: PawnsInterface,
  winner?: string,
): void {
  describe(message, function () {
    const initialState: AppState = {
      game: {
        board: initialBoard,
        boardToDraw: [['']],
        PLAYER1: {
          pawnsInHand: initialPawns[PLAYER1].pawnsInHand,
          pawnsOnBoard: initialPawns[PLAYER1].pawnsOnBoard,
          color: '#00F',
          name: player1Name,
        },
        PLAYER2: {
          pawnsInHand: initialPawns[PLAYER2].pawnsInHand,
          pawnsOnBoard: initialPawns[PLAYER2].pawnsOnBoard,
          color: '#0F0',
          name: player2Name,
        },
        currentPlayer: currentPlayer,
        currentAction: action,
        boxSize: 0,
        nextMove: initialMessage,
        millSize: 3,
        cacheSelectedPawn: {
          column: -1,
          row: -1,
        },
        winner: '',
      }
    };

    const expectedState: AppState = {
      game: {
        board: expectedBoard,
        boardToDraw: [['']],
        PLAYER1: {
          pawnsInHand: expectedPawns[PLAYER1].pawnsInHand,
          pawnsOnBoard: expectedPawns[PLAYER1].pawnsOnBoard,
          color: '#00F',
          name: player1Name,
        },
        PLAYER2: {
          pawnsInHand: expectedPawns[PLAYER2].pawnsInHand,
          pawnsOnBoard: expectedPawns[PLAYER2].pawnsOnBoard,
          color: '#0F0',
          name: player2Name,
        },
        currentPlayer: nextPlayer,
        currentAction: actionAfter,
        boxSize: 0,
        nextMove: expectedMessage,
        millSize: 3,
        cacheSelectedPawn: {
          column: -1,
          row: -1,
        },
        winner: winner || '',
      }
    };

    beforeAll(() => {
      returnedActions = gameLogic(row, column, initialState);
      returnedState = returnedActions.reduce((state: GameState, action: any) => {
        return gameReducer(state, action as any);
      }, initialState.game);
    });

    it('should work', function () {
      expect(returnedState).toEqual(expectedState.game);
    });
  });
}



describe('Empty board', () => {
  testGameLogic(
  'when player1 puts pawn on board (0,0)',
    generateBoard(`
*-----*-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-*-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
   `),
    generateBoard(`
0-----*-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-*-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
   `),
    PUT_ACTION,
    PUT_ACTION,
    PLAYER1,
    PLAYER2,
    0,
    0,
    putPawnMessage('Player 1'),
    putPawnMessage('Player 2'),
    {
      PLAYER1: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      },
      PLAYER2: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      }
    },
    {
      PLAYER1: {
        pawnsInHand: 8,
        pawnsOnBoard: 1,
      },
      PLAYER2: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      }
    }
  );
});

import { gameLogic } from './game.logic';
import { Board, generateBoard } from './board.generator';
import { ACTIONS, GameState, PLAYERS } from './game.helpers';
import { putPawnMessage, removePawnMessage } from './game.messages';
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

interface TestState {
  board: Board,
  currentPlayer: string,
  message: string,
  pawns: PawnsInterface,
  action: string,
}

interface Move {
  row: number,
  column: number,
}

function createMovement(row: number, column: number): Move {
  return { row, column };
}

function testGameLogic(
  message: string,
  initState: TestState,
  currentMove: Move,
  expState: TestState,
  winner?: string,
): void {
  describe(message, function () {
    const initialState: AppState = {
      game: {
        board: initState.board,
        boardToDraw: [['']],
        PLAYER1: {
          pawnsInHand: initState.pawns[PLAYERS.P_1].pawnsInHand,
          pawnsOnBoard: initState.pawns[PLAYERS.P_1].pawnsOnBoard,
          color: '#00F',
          name: player1Name,
        },
        PLAYER2: {
          pawnsInHand: initState.pawns[PLAYERS.P_2].pawnsInHand,
          pawnsOnBoard: initState.pawns[PLAYERS.P_2].pawnsOnBoard,
          color: '#0F0',
          name: player2Name,
        },
        currentPlayer: initState.currentPlayer,
        currentAction: initState.action,
        boxSize: 0,
        nextMove: initState.message,
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
        board: expState.board,
        boardToDraw: [['']],
        PLAYER1: {
          pawnsInHand: expState.pawns[PLAYERS.P_1].pawnsInHand,
          pawnsOnBoard: expState.pawns[PLAYERS.P_1].pawnsOnBoard,
          color: '#00F',
          name: player1Name,
        },
        PLAYER2: {
          pawnsInHand: expState.pawns[PLAYERS.P_2].pawnsInHand,
          pawnsOnBoard: expState.pawns[PLAYERS.P_2].pawnsOnBoard,
          color: '#0F0',
          name: player2Name,
        },
        currentPlayer: expState.currentPlayer,
        currentAction: expState.action,
        boxSize: 0,
        nextMove: expState.message,
        millSize: 3,
        cacheSelectedPawn: {
          column: -1,
          row: -1,
        },
        winner: winner || '',
      }
    };

    beforeAll(() => {
      returnedActions = gameLogic(currentMove.row, currentMove.column, initialState);
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
  const zeroStep: TestState = {
    board: generateBoard(`
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
    currentPlayer: PLAYERS.P_1,
    message: putPawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      },
      PLAYER2: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      },
    },
    action: ACTIONS.PUT,
  };

  const firstStep: TestState = {
    board: generateBoard(`
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
    currentPlayer: PLAYERS.P_2,
    message: putPawnMessage('Player 2'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 8,
        pawnsOnBoard: 1,
      },
      PLAYER2: {
        pawnsInHand: 9,
        pawnsOnBoard: 0,
      },
    },
    action: ACTIONS.PUT,
  };

  const secondStep: TestState = {
    board: generateBoard(`
0-----*-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-8-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_1,
    message: putPawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 8,
        pawnsOnBoard: 1,
      },
      PLAYER2: {
        pawnsInHand: 8,
        pawnsOnBoard: 1,
      },
    },
    action: ACTIONS.PUT,
  };

  const thirdStep: TestState = {
    board: generateBoard(`
0-----0-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-8-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_2,
    message: putPawnMessage('Player 2'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 7,
        pawnsOnBoard: 2,
      },
      PLAYER2: {
        pawnsInHand: 8,
        pawnsOnBoard: 1,
      },
    },
    action: ACTIONS.PUT,
  };
  const fourthStep: TestState = {
    board: generateBoard(`
0-----0-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-8-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_1,
    message: putPawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 7,
        pawnsOnBoard: 2,
      },
      PLAYER2: {
        pawnsInHand: 7,
        pawnsOnBoard: 2,
      },
    },
    action: ACTIONS.PUT,
  };
  const fifthStep: TestState = {
    board: generateBoard(`
1-----1-----1!
|     |     |!
| *---*---* |!
| |   |   | |!
| | B-B-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_1,
    message: removePawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 6,
        pawnsOnBoard: 3,
      },
      PLAYER2: {
        pawnsInHand: 7,
        pawnsOnBoard: 2,
      },
    },
    action: ACTIONS.TAKE,
  };
  const sixthStep: TestState = {
    board: generateBoard(`
1-----1-----1!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-*-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_2,
    message: putPawnMessage('Player 2'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 6,
        pawnsOnBoard: 3,
      },
      PLAYER2: {
        pawnsInHand: 7,
        pawnsOnBoard: 1,
      },
    },
    action: ACTIONS.PUT,
  };
  const seventhStep: TestState = {
    board: generateBoard(`
1-----1-----1!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-*-* | |!
| | |   | | |!
*-*-8   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_1,
    message: putPawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 6,
        pawnsOnBoard: 3,
      },
      PLAYER2: {
        pawnsInHand: 6,
        pawnsOnBoard: 2,
      },
    },
    action: ACTIONS.PUT,
  };
  const eighthStep: TestState = {
    board: generateBoard(`
1-----1-----1!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-*-* | |!
| | |   | | |!
*-*-8   *-*-0!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_2,
    message: putPawnMessage('Player 2'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 5,
        pawnsOnBoard: 4,
      },
      PLAYER2: {
        pawnsInHand: 6,
        pawnsOnBoard: 2,
      },
    },
    action: ACTIONS.PUT,
  };
  const ninethStep: TestState = {
    board: generateBoard(`
1-----1-----1!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-*-* | |!
| | |   | | |!
*-*-8   *-*-0!
| | |   | | |!
| | *-8-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
     `),
    currentPlayer: PLAYERS.P_1,
    message: putPawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 5,
        pawnsOnBoard: 4,
      },
      PLAYER2: {
        pawnsInHand: 5,
        pawnsOnBoard: 3,
      },
    },
    action: ACTIONS.PUT,
  };
  const tenthStep: TestState = {
    board: generateBoard(`
1-----1-----2!
|     |     |!
| *---*---* |!
| |   |   | |!
| | B-*-* | |!
| | |   | | |!
*-*-B   *-*-1!
| | |   | | |!
| | *-B-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----1!
     `),
    currentPlayer: PLAYERS.P_1,
    message: removePawnMessage('Player 1'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 4,
        pawnsOnBoard: 5,
      },
      PLAYER2: {
        pawnsInHand: 5,
        pawnsOnBoard: 3,
      },
    },
    action: ACTIONS.TAKE,
  };
  const eleventhStep: TestState = {
    board: generateBoard(`
1-----1-----2!
|     |     |!
| *---*---* |!
| |   |   | |!
| | 8-*-* | |!
| | |   | | |!
*-*-*   *-*-1!
| | |   | | |!
| | *-8-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----1!
     `),
    currentPlayer: PLAYERS.P_2,
    message: putPawnMessage('Player 2'),
    pawns: {
      PLAYER1: {
        pawnsInHand: 4,
        pawnsOnBoard: 5,
      },
      PLAYER2: {
        pawnsInHand: 5,
        pawnsOnBoard: 2,
      },
    },
    action: ACTIONS.PUT,
  };

  testGameLogic(
  'when player1 puts pawn on board (0,0)',
    zeroStep,
    createMovement(0, 0),
    firstStep,
  );

  testGameLogic(
    'when player2 puts pawn on board (4,6)',
    firstStep,
    createMovement(4, 6),
    secondStep,
  );

  testGameLogic(
    'when player1 puts pawn on board (0,6)',
    secondStep,
    createMovement(0, 6),
    thirdStep,
  );

  testGameLogic(
    'when player2 puts pawn on board (4,4)',
    thirdStep,
    createMovement(4, 4),
    fourthStep,
  );

  testGameLogic(
    'when player1 puts pawn on board (0,12)',
    fourthStep,
    createMovement(0, 12),
    fifthStep,
  );

  testGameLogic(
    'when player1 takes pawn from board (4,6)',
    fifthStep,
    createMovement(4, 6),
    sixthStep,
  );

  testGameLogic(
    'when player2 puts pawn on board (6,4)',
    sixthStep,
    createMovement(6, 4),
    seventhStep,
  );

  testGameLogic(
    'when player1 puts pawn on board (6,12)',
    seventhStep,
    createMovement(6, 12),
    eighthStep,
  );

  testGameLogic(
    'when player2 puts pawn on board (8,6)',
    eighthStep,
    createMovement(8, 6),
    ninethStep,
  );

  testGameLogic(
    'when player1 puts pawn on board (12,12)',
    ninethStep,
    createMovement(12, 12),
    tenthStep,
  );

  testGameLogic(
    'when player1 takes pawn from board (6,4)',
    tenthStep,
    createMovement(6, 4),
    eleventhStep,
  );
});

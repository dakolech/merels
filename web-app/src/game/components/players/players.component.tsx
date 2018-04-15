import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';
import { PLAYER, PLAYERS } from '../../../shared';
interface PlayerTabProps {
  player: PLAYER;
}

interface PlayerProps {
  PLAYER1: PLAYER;
  PLAYER2: PLAYER;
  boxSize: number;
}

function PlayerTab(props: PlayerTabProps) {
  const PawnIcon = styled.i`
      font-size: 30px;
      color: ${props.player.color};
      `;

  const Container = styled.div`
    margin: 10px 0;
  `;

  return (
    <Container>
      <div> {props.player.name} <PawnIcon className="fa fa-circle" /></div>
      <div> Pawns in the hand: {props.player.pawnsInHand} </div>
      <div> Pawns on the board: {props.player.pawnsOnBoard} </div>
    </Container>
  );
}

function Players(props: PlayerProps) {
  const { PLAYER1: player1, PLAYER2: player2 } = props;
  const Container = styled.div`
    width: ${3 * props.boxSize}px;
  `;

  return (
    <Container>
      <PlayerTab player={player1} />
      <PlayerTab player={player2} />
    </Container>
  );
}

const mapStateToProps = (state: AppState) => ({
  PLAYER1: path(['game', PLAYERS.P_1], state),
  PLAYER2: path(['game', PLAYERS.P_2], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const PlayersComponent = connect(mapStateToProps)(Players);

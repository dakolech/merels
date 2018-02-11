import * as React from 'react';
import { connect } from 'react-redux';
import { BoardCell } from '../../../shared';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';
import { PLAYER1, PLAYER2 } from '../../../shared';

interface OwnProps {
  box: BoardCell;
  boxSize: number;
}

interface StateProps {
  PLAYER1: string;
  PLAYER2: string;
}

function Pawn(props: OwnProps&StateProps) {
  const PawnIcon = styled.i`
    font-size: ${props.boxSize}px;
    color: ${props[props.box.pawn]};
  `;
  return props.box.pawn ? <PawnIcon className="fa fa-circle" /> : null;
}

const mapStateToProps = (state: AppState): StateProps => ({
  PLAYER1: path(['game', PLAYER1, 'color'], state),
  PLAYER2: path(['game', PLAYER2, 'color'], state),
});

// tslint:disable-next-line:no-any
export const PawnComponent = connect<StateProps, any, any>(mapStateToProps)(Pawn);

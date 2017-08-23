import * as React from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { AppState } from '../../../configureStore';

// import { styles } from '../board.styles';

interface Props {
  nextMove: string;
}

function NextMove(props: Props) {
  return (
    <span> {props.nextMove} </span>
  );
}

const mapStateToProps = (state: AppState) => ({
  nextMove: path<string>(['game', 'nextMove'], state),
});

export const NextMoveComponent = connect(mapStateToProps)(NextMove);

import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { BoardCell } from '../../board.generator';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';
import { PawnComponent } from './pawn.component';
import { bindActionCreators } from 'redux';
import { Action, nextMove, SetPawnType } from '../../game.actions';

interface OwnProps {
  column: number;
  row: number;
}

interface StateProps {
  box: BoardCell;
  boxSize: string;
  nextMove: (payload: SetPawnType) => Action;
}

// tslint:disable-next-line:no-any
function PawnContainer(props: OwnProps&StateProps): any {
  const Container = styled.div`
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: ${props.box.isHighlighted ? 'rgba(0,0,255,0.5)' : 'rgba(0,0,0,0)'};
    border: 1px solid ${props.box.isInMill ? 'rgba(0,255,0,0.5)' : 'rgba(0,0,0,0)'}
  `;

  return props.box.isPawnBox && (
    <Container onClick={() => props.nextMove({ column: props.column, row: props.row })}>
      <span
        style={{ width: props.boxSize, height: props.boxSize }}
      />

    <PawnComponent key={props.box.id} boxSize={props.boxSize} box={props.box} />
    </Container>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return bindActionCreators({ nextMove }, dispatch);
}

// tslint:disable-next-line:no-any
const mapStateToProps = (state: AppState, ownProps: OwnProps): any => ({
  box: path(['game', 'board', ownProps.column, ownProps.row], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const PawnContainerComponent =
// tslint:disable-next-line:no-any
  connect<StateProps, OwnProps, any>(mapStateToProps, mapDispatchToProps)(PawnContainer);

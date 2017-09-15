import * as React from 'react';
import './App.css';
import './generated-font/css/merels.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import { BoardContainerComponent } from './game/components/boardContainer/boardContainer.component';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from './configureStore';
import { path } from 'ramda';

const Container = styled.div``;
const Footer = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterContainer = styled.div`
  text-align: center;
`;

const Title = styled.div`
  font-weight: 600;
`;

const Link = styled.div`
  font-size: 14px;
`;

const Version = styled.div`
  font-size: 12px;
  position: relative;
  
  .build-info {
    display: none;
    position: absolute;
    top: -40px;
    right: -50px;
    background-color: rebeccapurple;
    color: white;
    padding: 5px;
    border: 1px solid yellow;
    border-radius: 10%;
    text-align: left;
   }
  
  &:hover {
    .build-info {
      display: block;
    }
  }
  
`;

function App() {
  return (
    <Container>
      <BoardContainerComponent />
      <Footer>
        <FooterContainer>
          <Title> DAKO Software 2017 </Title>
          <Link> Source: <a href="https://github.com/dakolech/merels">Github</a></Link>
          <Version>
            v{process.env.REACT_APP_VERSION || '0.1.1'}
            <div className="build-info">
              <div>Commit: <a href={'https://github.com/dakolech/merels/commit/' + process.env.REACT_APP_COMMIT}>
                {process.env.REACT_APP_COMMIT}</a>
              </div>
              <div>Branch: <a href={'https://github.com/dakolech/merels/tree/' + process.env.REACT_APP_BRANCH}>
                {process.env.REACT_APP_BRANCH}</a>
              </div>
              <div>Build: <a href={'https://travis-ci.org/dakolech/merels/builds/' + process.env.REACT_APP_BUILD_ID}>
                #{process.env.REACT_APP_BUILD_NUMBER}</a>
              </div>
            </div>
          </Version>
        </FooterContainer>
      </Footer>
    </Container>
  );
}

const mapStateToProps = (state: AppState) => ({
  board: path(['game', 'boardToDraw'], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const AppComponent = connect(mapStateToProps)(App);

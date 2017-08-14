

export const padding = 20;

export const styles = {
  boardIcon: {
    position: 'absolute',
    zIndex: 0,
    left: 0,
    top: 0,
  },
  pawnIcon: {
    position: 'absolute',
    zIndex: 3,
    left: 1,
    top: 0,
  },
  touchable: {
    color: 'rgba(0,0,0,0)',
    position: 'absolute',
    zIndex: 4,
    left: 0,
    top: 0,
  },
  row: {
    flexDirection: 'row',
    padding,
  },
  boardComponent: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameComponent: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    height: 100,
  },
  nextMove: {
    // flex: 1,
    height: 50,
  },
  players: {
    // flex: 1,
  },
  highlighted: {
    backgroundColor: 'rgba(0,0,255,0.5)',
  },
  highlightedMill: {
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
};

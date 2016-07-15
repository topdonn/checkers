import React from 'react';
import Square from './Square';

class Board extends React.Component {

  constructor(props) {
    console.log('constructor');
    super(props);
    console.log('constructor props:', props);
    this.state = { pieces: props.pieces };
  }

//   componentWillReceiveProps: function(nextProps) {
//   this.setState({
//     likesIncreasing: nextProps.likeCount > this.props.likeCount
//   });
// }

  render() {
    console.log('props:', this.props, 'state:', this.state);


    const squares = [];
    const colorArray = ['light', 'dark'];
    for (let y = 8; y > 0; y--) {
      for (let x = 1; x < 9; x++ ) {
        let color = colorArray[0];
        let piece = this.state.pieces.find((piece) => piece.x === x && piece.y === y);
        colorArray.reverse();
        squares.push({ x, y, color, piece });
      }
      colorArray.reverse();
    }
    return(
      <div className="checkerBoardBox">
         {squares.map(info => <Square key={`${info.x},${info.y}`} ref={`${info.x},${info.y}`} color={info.color} piece={info.piece} />)}
      </div>

    )
  }


}

export default Board;

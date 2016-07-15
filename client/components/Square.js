import React from 'react';

class Square extends React.Component {

  constructor(props){
    super(props);
    this.state = { piece: this.props.piece };
    console.log("Props In Square Are", this.props);
  }

  render() {
    let squareColor = '';
    let playerName = 'nobody';
    if (this.state.piece) { playerName = this.state.piece.player };
    if (this.props.color === 'dark') { squareColor = 'checkerSquareDark'; }
    else {
      squareColor = 'checkerSquareLight';
    }

    return (
      <div className={squareColor}>
        <p>{playerName}</p>
      </div>
    );
  }
}

export default Square;

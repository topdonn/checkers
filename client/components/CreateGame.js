import React from 'react';

class CreateGame extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return(
      <div className="createGameBox">
        <h3>Play A New Game</h3>
        <button onClick={this.props.newGame}>Start</button>
      </div>
    )
  }


}

export default CreateGame;

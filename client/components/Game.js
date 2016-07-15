import React from 'react';
import CreatePlayer from './CreatePlayer';
import Board from './Board';
import CreateGame from './CreateGame';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pieces: []};
    this.newGame = this.newGame.bind(this);
  }

  componentDidMount() {

  }

  newGame() {
    console.log('starting a new game...');
    const body = { player1: '57892c3c4d4b4b7665c5ee23', player2: '57892c72cd61b8d865e47988' };
    fetch('/games', { method: 'post', body, headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(j => {
        this.setState({ pieces: j.game.board })
        console.log('--------***', this.state);
      });
  }


  render() {
    return (
      <div className="container">

        <div className="row">
          <h1>Game!</h1>
        </div>

        <div className="row">

          <div className="col-md-8">
            <Board pieces={this.state.pieces}/>
          </div>

          <div className="col-md-4">
              <CreatePlayer />
              <CreateGame newGame={this.newGame}/>
          </div>

        </div>

      </div>

    );
  }

}

export default Game;

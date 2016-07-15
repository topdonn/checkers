import React from 'react';

class CreatePlayer extends React.Component {

  constructor(props){
    super(props);
    this.clearInputs = this.clearInputs.bind(this);
    this.createPlayer = this.createPlayer.bind(this);
  }

  createPlayer(){
    const name = this.refs.name.value;
    const body = JSON.stringify({ name });
    fetch('/players', { method: 'post', body, headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())
    .then(j => {
      console.log(j.player);
    })
    .then(() => this.clearInputs());
  }

  clearInputs() {
    this.refs.name.value = '';
  }

  render() {
    return(
      <div className="createPlayerBox">
        <h3>Create A New Player</h3>
        <label>Name</label>
        <input ref="name" type="text" />
        <button onClick={this.createPlayer}>Create</button>
      </div>

    )
  }


}

export default CreatePlayer;

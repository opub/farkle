import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Dice extends React.Component {
    render() {
        return (
            <button className={this.props.held ? 'held' : "dice"} onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dice: Array.from({ length: 6 }, () => Math.ceil(Math.random() * 6)),
            held: Array(6).fill(false)
        };
    }

    handleClick(i) {
        console.log("handleClick", i);
        const held = this.state.held.slice();
        held[i] = true;
        this.setState({ held: held });
    }

    handleRoll() {
        console.log("handleRoll");
        const dice = this.state.dice.slice();
        for(let i=0; i < dice.length; i++) {
            if(!this.state.held[i]) {
                dice[i] = Math.ceil(Math.random() * 6);
            }
        }
        this.setState({ dice: dice });
    }

    handleBank() {
        console.log("TODO handleBank");
    }

    renderDice(i) {
        return (
            <Dice
                value={this.state.dice[i]}
                held={this.state.held[i]}
                onClick={() => this.handleClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderDice(0)}
                    {this.renderDice(1)}
                    {this.renderDice(2)}
                    {this.renderDice(3)}
                    {this.renderDice(4)}
                    {this.renderDice(5)}
    
                    <div className="action" onClick={() => this.handleRoll()}>Roll</div>
                    <div className="action" onClick={() => this.handleBank()}>Bank</div>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

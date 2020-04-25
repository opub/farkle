import React from 'react';
import ReactDOM from 'react-dom';
import { checkBoard } from './logic.js';
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
            dice: Array(6).fill(0),
            held: Array(6).fill(false),
            rollPoints: 0,
            turnPoints: 0,
            totalPoints: 0,
            farkle: false,
            clicked: false
        };
    }

    componentDidMount() {
        this.handleRoll();
    }

    handleClick(i) {
        console.log("handleClick", i);
        const held = this.state.held.slice();
        held[i] = true;
        this.setState({ held: held, clicked: true });
    }

    handleRoll() {
        console.log("handleRoll");

        // reset held if all held
        let allHeld = true;
        let held = this.state.held.slice();
        held.forEach(item => {
            allHeld = allHeld && item;
        });
        if(allHeld) {
            held = Array(6).fill(false);
        }

        // roll all unheld dice
        const rolled = [];
        const dice = this.state.dice.slice();
        for (let i = 0; i < dice.length; i++) {
            if (!held[i]) {
                dice[i] = Math.ceil(Math.random() * 6);
                rolled.push(dice[i]);
            }
        }

        // calculate results
        const results = checkBoard(rolled);
        if(results.farkle) {
            held = Array(6).fill(false);
        }
        this.setState({
            rollPoints: results.farkle ? 0 : results.points,
            turnPoints: results.farkle ? 0 : this.state.turnPoints + results.points,
            farkle: results.farkle,
            dice: dice,
            held: held,
            clicked: false
        });
    }

    handleBank() {
        this.setState({
            totalPoints: this.state.totalPoints + this.state.turnPoints,
            rollPoints: 0,
            turnPoints: 0,
            farkle: false,
            held: Array(6).fill(false)
        }, () => this.handleRoll());
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
        // const status = this.state.farkle ? "FARKLE!" : "Roll Points: " + this.state.rollPoints + ", Turn Points: " + this.state.turnPoints;

        return (
            <div>
                <div className="board-row">
                    {this.renderDice(0)}
                    {this.renderDice(1)}
                    {this.renderDice(2)}
                    {this.renderDice(3)}
                    {this.renderDice(4)}
                    {this.renderDice(5)}

                    <div className={this.state.clicked || this.state.farkle ? "action" : "inaction"} onClick={() => { if(this.state.clicked || this.state.farkle) this.handleRoll() }}>Roll</div>
                    <div className={this.state.turnPoints >= 500 ? "action" : "inaction"} onClick={() => { if(this.state.turnPoints >= 500) this.handleBank() }}>Bank</div>
                </div>

                <div className="score-row">Roll Points: {this.state.rollPoints}</div>
                <div className="score-row">Turn Points: {this.state.turnPoints}</div>
                <div className="score-row">Total Points: {this.state.totalPoints}</div>
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
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

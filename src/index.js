import React from 'react';
import ReactDOM from 'react-dom';
import { checkBoard, getCombos } from './logic.js';
import './index.css';

class Dice extends React.Component {
    render() {
        return (
            <div className={this.props.held ? 'held' : "dice"} onClick={this.props.onClick}>
                <i className={"df-solid-small-dot-d6-" + this.props.value}></i>
            </div>
        );
    }
}

class ComboRows extends React.Component {
    render() {
        return (
            getCombos(this.props.combos).map(combo => this.renderCombo(combo))
        );
    }

    renderCombo(combo) {
        return (
            <ComboRow
                key={combo.key}
                name={combo.name}
                points={combo.points}
            />
        )
    }
}

class ComboRow extends React.Component {
    render() {
        return (
            <div className="combo">
                <div className="combo-name">{this.props.name}</div>
                <div className="combo-points">{this.props.points}</div>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            combos: "classic",
            dice: Array(6).fill(0),
            held: Array(6).fill(false),
            turn: [],
            allowed: [],
            rollPoints: 0,
            turnPoints: 0,
            totalPoints: 0,
            farkle: false,
            clicked: false
        };
        this.handleChangeCombos = this.handleChangeCombos.bind(this);
    }

    componentDidMount() {
        this.handleRoll();
    }

    handleClick(i) {
        console.log("handleClick", i);

        const die = this.state.dice[i];
        const turn = this.state.turn.slice();
        const held = this.state.held.slice();
        const allowed = this.state.allowed.slice();
        const turnID = turn.indexOf(die);
        const allowID = allowed.indexOf(die);

        if (held[i] && turnID > -1) {
            // release hold
            turn.splice(turnID, 1);
            allowed.push(die);
            held[i] = false;
        } else if (!held[i] && allowID > -1) {
            // hold
            turn.push(die);
            allowed.splice(allowID, 1);
            held[i] = true;
        }

        // calculate results
        const results = checkBoard(turn, this.state.combos);
        this.setState({
            rollPoints: results.points,
            held: held,
            turn: turn,
            allowed: allowed,
            clicked: results.points > 0
        });
    }

    handleRoll() {
        console.log("handleRoll");

        // reset held if all held
        let allHeld = true;
        let held = this.state.held.slice();
        if (!this.state.farkle) {
            held.forEach(item => {
                allHeld = allHeld && item;
            });
        }
        if (allHeld) {
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
        const results = checkBoard(rolled, this.state.combos);
        this.setState({
            rollPoints: 0,
            turnPoints: results.farkle ? 0 : this.state.rollPoints + this.state.turnPoints,
            farkle: results.farkle,
            dice: dice,
            held: held,
            turn: [],
            allowed: results.possible,
            clicked: false
        });
    }

    handleBank() {
        console.log("handleBank");

        this.setState({
            totalPoints: this.state.totalPoints + this.state.rollPoints + this.state.turnPoints,
            rollPoints: 0,
            turnPoints: 0,
            farkle: false,
            held: Array(6).fill(false),
            turn: [],
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

    handleChangeCombos(event) {
        this.setState({ 
            combos: event.target.value,
            dice: Array(6).fill(0),
            held: Array(6).fill(false),
            turn: [],
            allowed: [],
            rollPoints: 0,
            turnPoints: 0,
            totalPoints: 0,
            farkle: false,
            clicked: false
         }, () => this.handleRoll());
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

                    <div className={this.state.clicked || this.state.farkle ? "action" : "inaction"}
                        onClick={() => { if (this.state.clicked || this.state.farkle) this.handleRoll() }}>Roll</div>
                    <div className={this.state.rollPoints + this.state.turnPoints >= 500 ? "action" : "inaction"}
                        onClick={() => { if (this.state.rollPoints + this.state.turnPoints >= 500) this.handleBank() }}>Bank</div>
                </div>

                <div className="score-row">
                    <div className="score">{this.state.farkle ? "" : "Roll Points:"} <b>{this.state.farkle ? "FARKLE!" : this.state.rollPoints}</b></div>
                    <div className="score">Turn Points: <b>{this.state.turnPoints}</b></div>
                    <div className="score">Total Points: <b>{this.state.totalPoints}</b></div>
                </div>

                <div className="detail-row">
                    <div className="score-row">
                        <b>Scoring</b>
                        <select value={this.state.combos} onChange={this.handleChangeCombos} className="combolist">
                            <option value="classic">Classic</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                    <ComboRows combos={this.state.combos} />
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div>
                <div className="title">Farkle</div>
                <div className="game">
                    <div className="game-board">
                        <Board />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

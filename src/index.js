import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    if (props.highlight) {
        return (
            <button className = "highlightedSpot" onClick = {props.onClick}>
                {props.value}
            </button>
        )
    }
    
    return (
        <button className = "boardSpot" onClick = {props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square highlight = {this.props.highlightedSquares[i]} value = {this.props.values[i]} onClick = {() => this.props.onClick(i)} />
    }

    render() {
        let board;
        return (
            <div id = "boardGridSpot">
                <div id = "boardWrapper">
                    <div>
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div>
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div>
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
            </div>
            
            
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            values: [
                {squares: [null, null, null, null, null, null, null, null, null]},
            ],
            isXTurn: true,
            currentlyDisplayedMove: 0,
            moveTracker: new Map(),
            reversedMovesList: false,
            highlightedSquares: [false, false, false, false, false, false, false, false, false],
            displayRestartButton: false,
        }
    }

    handleSquareClick(i) {
        let history = this.state.values.slice(0, this.state.currentlyDisplayedMove + 1);
        let currentBoard = history[history.length - 1].squares.slice();

        if (currentBoard[i] || this.checkWinner(currentBoard)) {
            return;
        }

        currentBoard[i] = this.state.isXTurn ? "X" : "O";
        let moveTracker = new Map(this.state.moveTracker);
        moveTracker.set(this.state.currentlyDisplayedMove + 1, (this.state.isXTurn ? "X" : "O") + i);
        
        this.setState({
            values: history.concat([{
                squares : currentBoard,
            }]),
            isXTurn: !this.state.isXTurn,
            currentlyDisplayedMove: this.state.currentlyDisplayedMove + 1,
            moveTracker: moveTracker,
            displayRestartButton: true,
        })
    }

    restart() {
        this.setState(
            {
                values: [
                    {squares: [null, null, null, null, null, null, null, null, null]},
                ],
                isXTurn: true,
                currentlyDisplayedMove: 0,
                moveTracker: new Map(),
                reversedMovesList: false,
                highlightedSquares: [false, false, false, false, false, false, false, false, false],
                displayRestartButton: false,
            }
        )
    }

    checkWinner(board) {
        let lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < lines.length; i++) {
            let [a, b, c] = lines[i];
            if (board[a] && board[a] == board[b] && board[a] == board[c]) {
                return board[a];
            }
        }

        if (board[0] && board[1] && board[2] && board[3] && board[4] && board[5] && board[6] && board[7] && board[8]) {
            return "T";
        }
    }

    getButtons() {
         let buttons = this.state.values.map(
            (board, move) => {
                let message;
                if (move === 0) {
                    message = "Go to game start"; 
                } else {
                    let movePosRaw = this.state.moveTracker.get(move);
                    let movePosFormatted = movePosRaw[0] + " at (" + (Number(movePosRaw[1]) % 3) + ", " + (Math.floor(Number(movePosRaw[1]) / 3)) + ")"; 
                    message = "Go to move " + move + ": " + movePosFormatted;
                }

                if (move === this.state.currentlyDisplayedMove) {
                    return (
                        <li key = {move}>
                            <button class = "timeTravelButton" onClick = {() => this.switchTo(move)}><b>{message}</b></button>
                        </li>
                    );
                }

                return (
                    <li key = {move}>
                        <button onClick = {() => this.switchTo(move)}>{message}</button>
                    </li>
                );
            }
        );

        if (this.state.reversedMovesList) {
            return buttons.reverse();
        }

        return buttons;
    }

    switchTo(move) {
        this.setState({
            currentlyDisplayedMove: move,
            isXTurn: move % 2 === 0 ? true : false,
        });
    }

    render() {
        let history = this.state.values;
        let currentBoard = history[this.state.currentlyDisplayedMove].squares.slice();
        let timeTravelButtons = this.getButtons();
        let statusMessage;

        let winner = this.checkWinner(currentBoard);

        if(winner == "X" || winner == "O") {
            statusMessage = "Congratulations " + this.checkWinner(currentBoard) + ", you win!"
        } else if (winner == "T") {
            statusMessage = "Oh no, It's a tie!"
        } else {
            statusMessage = "Next turn: " + (this.state.isXTurn ? "X" : "O");
        }
        
        // Conditionally render restart button
        let restartButton = null;

        if (this.state.displayRestartButton) {
            restartButton = (<button id = "restartButton" onClick = {() => this.restart()}>Click to Restart</button>);
        }

        return (
            <div id = "contentWrapper">
                <div></div>
                <div id = "headerGridCell">
                    <h1>Tic-Tac-Toe</h1>
                    {restartButton}
                </div>
                <div></div>
                <div></div>
                <Board 
                    values = {currentBoard}
                    onClick = {(i) => this.handleSquareClick(i)}
                    highlightedSquares = {this.state.highlightedSquares}     
                />
                <div></div>
                <div></div>
                <div id = "buttonsGridCell">
                    <div id = "statusMessage">{statusMessage}</div>
                    <div>
                        <ul id = "timeTravelList">
                            {timeTravelButtons}
                        </ul>
                        <button id = "toggleMovesListButton" onClick = {() => this.setState({reversedMovesList: !this.state.reversedMovesList})}>Reverse moves list</button>
                    </div>
                </div>
                <div></div>
            </div>
        )
    }
}

/* ============================================== */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
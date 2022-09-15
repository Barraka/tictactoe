//TODO - Okaciti na TOP
const aiGame = (() => {
    let score = {
        x : 10,
        o : -10,
        tie : 0,
    }
    const ai = 'x';
    const human = 'o';

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;
        for(let i = 0; i < 9; i++){
            if(gameBoard.fields[i] == ''){
                gameBoard.fields[i] = ai;
                let score = minimax(gameBoard.fields, 0, false);
                gameBoard.fields[i] = '';
                if(score > bestScore){
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameBoard.fields[move] = ai; 
        document.querySelector(`[data-index="${move}"]`).classList.add('x');
        gameBoard.board.classList.toggle('x');
        gameBoard.board.classList.toggle('o');
        if(game.check3InARow('x')){
            messageShow.win('X', game.check3InARow('x'));
            return;
        }
        if(game.checkDraw()){
            messageShow.draw();
        }
        game.nextPlayer = 'human';

    }

    const minimax = (board, depth, isMaximzing) => {
        if(game.check3InARow('x')){
            return score['x'];
        }else if(game.check3InARow('o')){
            return score['o'];
        }else if(game.checkDraw()){
            return score['tie'];
        }
    
        if(isMaximzing){
            let bestScore = -Infinity;
            for(let i = 0; i < 9; i++){
                if(board[i] == ''){
                    board[i] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }else{
            let bestScore = Infinity;
            for(let i = 0; i < 9; i++){
                if(board[i] == ''){
                    board[i] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
                    }
            return bestScore;
        }
    }

    return{
        minimax,
        bestMove
    }
})();

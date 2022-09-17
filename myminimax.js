function checkscore(target=gameboard.getBoard()) {
    //rows
    if(target[0][0]===1 && target[0][1]===1 && target[0][2]===1)return 1;
    if(target[0][0]===2 && target[0][1]===2 && target[0][2]===2)return 2;
    if(target[1][0]===1 && target[1][1]===1 && target[1][2]===1)return 1;
    if(target[1][0]===2 && target[1][1]===2 && target[1][2]===2)return 2;
    if(target[2][0]===1 && target[2][1]===1 && target[2][2]===1)return 1;
    if(target[2][0]===2 && target[2][1]===2 && target[2][2]===2)return 2;
    //columns
    if(target[0][0]===1 && target[1][0]===1 && target[2][0]===1)return 1;
    if(target[0][0]===2 && target[1][0]===2 && target[2][0]===2)return 2;
    if(target[0][1]===1 && target[1][1]===1 && target[2][1]===1)return 1;
    if(target[0][1]===2 && target[1][1]===2 && target[2][1]===2)return 2;
    if(target[0][2]===1 && target[1][2]===1 && target[2][2]===1)return 1;
    if(target[0][2]===2 && target[1][2]===2 && target[2][2]===2)return 2;
    //diags
    if(target[0][0]===1 && target[1][1]===1 && target[2][2]===1)return 1;
    if(target[0][0]===2 && target[1][1]===2 && target[2][2]===2)return 2;
    if(target[0][2]===1 && target[1][1]===1 && target[2][0]===1)return 1;
    if(target[0][2]===2 && target[1][1]===2 && target[2][0]===2)return 2;
    let count=0;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(target[i][j]!=='')count++;
        }
    }
    if(count===9)return -1;
    return 0;
}
let ai = 2;
let human = 1;

let bestMove = function(target=gameboard.getBoard()) {
    let bestScore = -Infinity;
    let move;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++) {
            if(target[i][j] === ''){
                target[i][j] = ai;
                let score = minimax(target, 0, false);  
                target[i][j] = '';              
                if(score > bestScore){
                    bestScore = score;
                    move = {i,j};
                }
                
            }
        }            
    }
    let celltarget=document.querySelector(`.c${move['i']}${move['j']}`);
    setTimeout(e=>{
        gameboard.makeMove(celltarget);
    },750);    
}

let minimax = function(board, depth, isMaximzing){ 
    let verifyscore=checkscore();
    if(verifyscore===1){
        return -10;
    }else if(verifyscore===2){
        return +10;
    }else if(verifyscore===-1){
        return 0;
    }  
    if(isMaximzing){
        let bestScore = -Infinity;
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++) {
                if(board[i][j] === ''){                    
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }                
        }
        return bestScore;
    }else{
        let bestScore = Infinity;
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++) {
                if(board[i][j] === ''){
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }                
        }
        return bestScore;
    }
}
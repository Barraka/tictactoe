let title=document.querySelector('.texttitle');
title.classList.add('animate__bounceInLeft','.animate__animated.animate__infinite');
let container=document.createElement('div');  
container.classList.add('container'); 

//Defining the gameboard, using a module:

let gameboard = (function () {
    

    let objectControls = {
        
        attachControls:function(){
            let buttonstart=document.createElement('button');
            buttonstart.classList.add('buttonstart');
            let buttonreset=document.createElement('button');
            buttonreset.id='buttonreset';
            buttonstart.textContent='Start';
            buttonreset.textContent='Reset';
            container.appendChild(buttonstart);
            container.appendChild(buttonreset);
            buttonstart.addEventListener('click',objectSelection.showSelection);
            buttonreset.addEventListener('click',mainApp.resetgame);
        },
        removeEventStart:function() {
            let buttonstart=container.querySelector('.buttonstart');
            buttonstart.removeEventListener('click',objectSelection.showSelection);
        },   
        addEventStart:function() {
            let buttonstart=container.querySelector('.buttonstart');
            buttonstart.addEventListener('click',objectSelection.showSelection);
        },
        hintStart:function() {
            let buttonstart=container.querySelector('.buttonstart');
            if(buttonstart.classList.contains('hvr-pulse-grow')){
                buttonstart.classList.remove('hvr-pulse-grow');
                setTimeout((e)=>{buttonstart.classList.add('hvr-pulse-grow');},200);
            }
            else buttonstart.classList.add('hvr-pulse-grow');        
        },
    };
    let objectSelection =  {        
        attachSelection:function() {
            let selection=document.createElement('div');
            selection.classList.add('selection', 'selectionHide','selectionAnimationOut');
            let text1=document.createElement('div');
            text1.classList.add('text1');
            text1.textContent='How many players?';
            let row=document.createElement('div');
            let range=document.createElement('input');
            let span1=document.createElement('span');
            let span2=document.createElement('span');
            span1.textContent=1;
            span2.textContent=2;
            Object.assign(range,{min:1,max:2,step:1,type:'range'});
            range.classList.add('range');
            row.appendChild(span1);
            row.appendChild(range);
            row.appendChild(span2);
            let text2=document.createElement('div');
            text2.textContent='Player 1 name:';
            let p1=document.createElement('input');
            p1.setAttribute('type','text');
            p1.id='player1';
            p1.setAttribute('placeholder','Player1');
            let text3=document.createElement('div');
            text3.textContent='Player 2 name:';
            let p2=document.createElement('input');
            p2.setAttribute('type','text');
            p2.id='player2';
            p2.setAttribute('placeholder','Player2');
            let go=document.createElement('button');
            go.classList.add('gobutton');
            go.textContent='Go!';
            selection.appendChild(text1);
            selection.appendChild(row);
            selection.appendChild(text2);
            selection.appendChild(p1);
            selection.appendChild(text3);
            selection.appendChild(p2);
            selection.appendChild(go);
            go.addEventListener('click',mainApp.gamestart);
            container.appendChild(selection);
        },
        eraseField:function(){
            text2.textContent='';
            text3.textContent='';
        },
        getname:function(n){
            let textName1=container.querySelector('#player1');
            let textName2=container.querySelector('#player2');
            if(n===1)return textName1.value;
            if(n===2)return textName2.value;
        },
        getNumberOfPlayers:function(){
            return range.value;
        },
        showSelection:function(){
            let selection=container.querySelector('.selection');
            objectScore.removeText();
            objectScore.removeAnimation();
            applyBackdrop();
            selection.classList.remove('selectionHide','selectionAnimationOut');
            selection.classList.add('selectionAnimationIn');
            objectControls.removeEventStart();
            
            let bs=container.querySelector('.gobutton');
            bs.style.display='block';
        },
        hideSelection:function() {
            let sel=container.querySelector('.selection');
            sel.classList.add('selectionHide','selectionAnimationOut');
            sel.classList.remove('selectionAnimationIn');
            let bs=container.querySelector('.gobutton');
            bs.style.display='none';
            //Erase fields & hide selection window
            let inputs=document.querySelectorAll('.selection input');
            inputs.forEach(x=>x.value="");
        },
    };
    let objectWinner = {              
        attachWinner:function() {
            let displaywinner=document.createElement('div');        
            displaywinner.classList.add('displaywinner', 'winnerhide');
            let winnertext1=document.createElement('div');
            winnertext1.textContent="Congratulations!";
            winnertext1.classList.add('winnertitle');
            let winnertext2=document.createElement('div');
            winnertext2.textContent="wins the game!";
            let winnername=document.createElement('div'); 
            winnername.classList.add('winnername');
            let okbutton=document.createElement('button');
            okbutton.classList.add('okbutton', 'gobutton');
            okbutton.textContent="OK";
            okbutton.addEventListener('click',this.winnerokbutton);
            displaywinner.appendChild(winnertext1);
            displaywinner.appendChild(winnername);
            displaywinner.appendChild(winnertext2);
            displaywinner.appendChild(okbutton);
            container.appendChild(displaywinner);
        },
        displayWinner:function() {
            let displaywinner=container.querySelector('.displaywinner'); 
            displaywinner.classList.add('displaywinnerIn');
            displaywinner.classList.remove('displaywinnerOut');
            objectWinner.winnerName(mainApp.currentPlayer.name);
            applyBackdrop();
            displaywinner.classList.remove('winnerhide');
        },
        hideWinner:function() {
            let displaywinner=container.querySelector('.displaywinner'); 
            displaywinner.classList.add('displaywinnerOut');
            displaywinner.classList.add('displaywinnerIn');
            displaywinner.classList.add('winnerhide');            
        },
        winnerName:function(who){
            let winnername=container.querySelector('.winnername');
            winnername.textContent=who;
        },
        eraseWinner:function(){
            let winnername=container.querySelector('.winnername');
            winnername.textContent='';
        },
        winnerokbutton:function() {
            objectWinner.hideWinner();
            mainApp.resetgame();
            removeBackdrop();
            objectScore.reset();    
            objectWinner.hideWinner();        
        },
    };
    let mainApp= {
        gamearray:[],
        player1:undefined,
        player2:undefined,
        hasStarted:false,
        currentPlayer:0,
        totalmoves:0,
        
        // ----
        attachBoard: function() {
            let board=document.createElement('div');
            board.classList.add('board');   
            let backdrop=document.createElement('div');
            backdrop.classList.add('backdrop');
            container.appendChild(backdrop);
            removeBackdrop();
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    let cell=document.createElement('div');
                    let span=document.createElement('span');
                    cell.classList.add('cell');
                    cell.classList.add(`c${i}${j}`);
                    cell.appendChild(span);
                    board.appendChild(cell);
                    cell.i=i;
                    cell.j=j;
                    cell.addEventListener('click',this.makemove);
                    cell.addEventListener('mouseover',hoverin);
                    cell.addEventListener('mouseout',hoverout);
                }            
            }
            container.appendChild(board);
        },           
        player:function(name, team,id){
            // ------ return ------
            return {name, team,id};
        },
        //Make the game start by initializing the array
        gamestart:function(){
            for(let i=0;i<3;i++) {
                mainApp.gamearray.push([]);
                for(let j=0;j<3;j++){
                    mainApp.gamearray[i].push('');
                }
            }
            mainApp.hasStarted=true;              
            //Create player objects
            let name1=objectSelection.getname(1);
            let name2=objectSelection.getname(2);
            player1=mainApp.player(name1 || "Player1","X",1);
            player2=mainApp.player(name2 || "Player2","O",2);
            objectSelection.hideSelection();
            removeBackdrop();
            mainApp.currentPlayer=player1;        
            objectScore.setText(mainApp.currentPlayer.name+', your turn');
            let cursor=container.querySelector('.board');
            cursor.classList.remove('boardO');      
            cursor.classList.add('boardX');
            objectScore.addNameAnimation();
        },
        //Reset the game
        resetgame:function(){
            if(!mainApp.hasStarted)return;
            mainApp.hasStarted=false;
            mainApp.gamearray=[];
            let cells=container.querySelector('.board').childNodes;
            cells.forEach(x=>{
                x.firstElementChild.textContent="";
                //x.classList="cell";
                x.classList.remove('player1','player2','animateCell');
            });            
            let start=container.querySelector('.buttonstart');
            start.addEventListener('click',objectSelection.showSelection);
            let gb=container.querySelector('.board');        
            gb.classList.remove('boardX','boardO');
            objectScore.reset();
        },
        //Change current player
        taketurn:function(human=true){
            mainApp.currentPlayer===player1 ? mainApp.currentPlayer=player2 : mainApp.currentPlayer=player1;
            objectScore.setText(mainApp.currentPlayer.name+ ", your turn.");
            let cursor=container.querySelector('.board');
            if(cursor.classList.contains('boardX')){
                cursor.classList.add('boardO');
                cursor.classList.remove('boardX');
            }
            else {
                cursor.classList.add('boardX');
                cursor.classList.remove('boardO');
            }
            if(!human&&mainApp.currentPlayer===player2)bestMove();
        },
        //Display moves & update array
        makemove:function(e,human=true) {
            if(!mainApp.hasStarted){
                objectControls.hintStart();
                return;
            }
            let target;
            if(human){
                target=e.currentTarget;
            }
            else {
                // target=container.querySelector(`c${e[0]}${e[1]}`); 
                target=e;                 
            }
            let currentcell=mainApp.gamearray[target.i][target.j]; 
            if(!currentcell) {
                mainApp.totalmoves++;
                target.classList.add('player'+mainApp.currentPlayer.id)
                mainApp.gamearray[target.i][target.j]=mainApp.currentPlayer.id;
                target.firstElementChild.textContent=mainApp.currentPlayer.team;            
                let check=mainApp.checkwin();
                if(check>0){
                    if(human)e.currentTarget.classList.remove('boardHover');
                    // objectWinner.displayWinner(mainApp.currentPlayer.name);
                    // 
                    return;
                }
                mainApp.taketurn(false);
                if(human)e.currentTarget.classList.remove('boardHover');
            }
        },
        //Check winning condition
        checkwin:function(human=false) {            
            //rows
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[0][1]===1 && mainApp.gamearray[0][2]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[0][1]===2 && mainApp.gamearray[0][2]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',0);return 2;};
            if(mainApp.gamearray[1][0]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[1][2]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',1);return 1;};
            if(mainApp.gamearray[1][0]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[1][2]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',1);return 2;};
            if(mainApp.gamearray[2][0]===1 && mainApp.gamearray[2][1]===1 && mainApp.gamearray[2][2]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',2);return 1;};
            if(mainApp.gamearray[2][0]===2 && mainApp.gamearray[2][1]===2 && mainApp.gamearray[2][2]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('row',2);return 2;};
            //columns
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[1][0]===1 && mainApp.gamearray[2][0]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[1][0]===2 && mainApp.gamearray[2][0]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',0);return 2;};
            if(mainApp.gamearray[0][1]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][1]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',1);return 1;};
            if(mainApp.gamearray[0][1]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][1]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',1);return 2;};
            if(mainApp.gamearray[0][2]===1 && mainApp.gamearray[1][2]===1 && mainApp.gamearray[2][2]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',2);return 1;};
            if(mainApp.gamearray[0][2]===2 && mainApp.gamearray[1][2]===2 && mainApp.gamearray[2][2]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('col',2);return 2;};
            //diags
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][2]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('diag1',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][2]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('diag1',0);return 2;};
            if(mainApp.gamearray[0][2]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][0]===1){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('diag2',0);return 1;};
            if(mainApp.gamearray[0][2]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][0]===2){if(human||gameboard.mainApp.currentPlayer.id===1)mainApp.animateWin('diag2',0);return 2;};
            if(mainApp.totalmoves===9)return -1;
            return 0;
        },
        animateWin:function(dir,num){
            let cell1, cell2, cell3;
            if(dir==='row'){
                cell1=container.querySelector(`.c${num}0`);
                cell2=container.querySelector(`.c${num}1`);
                cell3=container.querySelector(`.c${num}2`);
            }
            else if(dir==='col') {
                cell1=container.querySelector(`.c0${num}`);
                cell2=container.querySelector(`.c1${num}`);
                cell3=container.querySelector(`.c2${num}`);
            }
            else if(dir==='diag1'){
                cell1=container.querySelector('.c00');
                cell2=container.querySelector('.c11');
                cell3=container.querySelector('.c22');
            }
            else {
                cell1=container.querySelector('.c20');
                cell2=container.querySelector('.c11');
                cell3=container.querySelector('.c02');
            }
            objectScore.removeNameAnimation();
            objectScore.removeText();
            cell1.classList.add('animateCell');
            cell2.classList.add('animateCell');
            cell3.classList.add('animateCell');
            setTimeout(finish,1500);
            function finish(){
                objectWinner.displayWinner(mainApp.currentPlayer.name);
            }
        }
        
    };

    let objectScore = {
        scoreEle:'',
        attachScore:function(){
            let score=document.createElement('div'); 
            score.classList.add('score');
            let scoretext=document.createElement('div'); 
            scoretext.classList.add('scoretext');
            scoretext.id="scoretext";        
            score.appendChild(scoretext);
            container.appendChild(score);
            
        },
        getEle:function(){
            let scroll=container.querySelector('#scoretext');
            this.scoreEle=scroll;
        },
        
        removeText() {
            this.getEle();
            this.scoreEle.innerHTML='';
        },
        setText(t) {
            this.getEle();
            this.scoreEle.innerHTML=t;
        },
        removeAnimation(){
            this.getEle();
            this.scoreEle.classList.remove('scoretext');
        },
        addAnimation(){
            this.getEle();
            this.scoreEle.classList.add('scoretext');
        },
        addNameAnimation(){
            this.getEle();
            this.scoreEle.classList.add('nameanimation');
        },
        removeNameAnimation(){
            this.getEle();
            this.scoreEle.classList.remove('nameanimation');
        },
        reset() {
            this.getEle();
            this.addAnimation();
            this.setText('Press Start to play the game!');
        }
    }

    function applyBackdrop() {
        let b=container.querySelector('.backdrop');
        b.classList.remove('backdroptoggle'); 
    }
    function removeBackdrop() {
        let b=container.querySelector('.backdrop');
        b.classList.add('backdroptoggle'); 
    }
    
    
    function hoverin(e){
        if(e.currentTarget.firstElementChild.innerHTML==='' && mainApp.hasStarted)e.currentTarget.classList.add('boardHover');
    }
    function hoverout(e){
        e.currentTarget.classList.remove('boardHover');
    }

    // ----- private vars above this line -----
    return {
        objectControls,
        objectSelection,
        objectWinner,
        mainApp,        
        objectScore,
        applyBackdrop,
        removeBackdrop,
        hoverin,
        hoverout,        
    };
})();

// gameboard.displayboard();
gameboard.objectScore.attachScore();
gameboard.objectScore.reset();
gameboard.mainApp.attachBoard();
gameboard.objectControls.attachControls();
gameboard.objectSelection.attachSelection();
gameboard.objectWinner.attachWinner();
//----
document.body.appendChild(container);
let title=document.querySelector('.texttitle');
title.classList.add('animate__bounceInLeft','.animate__animated.animate__infinite');
let container=document.createElement('div');  
container.classList.add('container'); 

//Defining the gameboard, using a module:

let gameboard = (function () {
    

    let objectControls = (function() {
        let buttonstart=document.createElement('button');
        buttonstart.classList.add('buttonstart');
        let buttonreset=document.createElement('button');
        buttonreset.id='buttonreset';
        buttonstart.textContent='Start';
        buttonreset.textContent='Reset';
        container.appendChild(buttonstart);
        container.appendChild(buttonreset);
        buttonstart.addEventListener('click',showSelection);
        buttonreset.addEventListener('click',resetgame);
        let removeEventStart=function() {
            buttonstart.removeEventListener('click',showSelection);
        }        
        let addEventStart=function() {
            buttonstart.addEventListener('click',showSelection);
        }
        let hintStart =function() {
            let startbutton=document.querySelector('.buttonstart');
            if(startbutton.classList.contains('hvr-pulse-grow'))startbutton.classList.remove('hvr-pulse-grow');
            else startbutton.classList.add('hvr-pulse-grow');        
        }
        // -----------
        return {
            removeEventStart,
            addEventStart,
            hintStart,
        };
    })();
    let objectSelection = (function() {
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
        let text3=document.createElement('div');
        text3.textContent='Player 2 name:';
        let p2=document.createElement('input');
        p2.setAttribute('type','text');
        p2.id='player2';
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
        go.addEventListener('click',gamestart);
        function attachSelection() {
            container.appendChild(selection);
        }
        function eraseField(){
            text2.textContent='';
            text3.textContent='';
        }
        function getname(n){
            if(n===1)return text2.textContent;
            if(n===2)return text3.textContent;
        }
        function getNumberOfPlayers(){
            return range.value;
        }
        function showSelection(){
            objectScore.removeText();
            objectScore.removeAnimation();
            applyBackdrop();
            selection.classList.remove('selectionHide','selectionAnimationOut');
            selection.classList.add('selectionAnimationIn');
            objectControls.removeEventStart();
            
            let bs=document.querySelector('.gobutton');
            bs.style.display='block';
        }
        function hideSelection() {
            let sel=document.querySelector('.selection');
            sel.classList.add('selectionHide','selectionAnimationOut');
            sel.classList.remove('selectionAnimationIn');
            let bs=document.querySelector('.gobutton');
            bs.style.display='none';
            //Erase fields & hide selection window
            let inputs=document.querySelectorAll('.selection input');
            inputs.forEach(x=>x.value="");
        }
        // --------------
        return {
            eraseField,
            attachSelection,
            getname,
            getNumberOfPlayers,
            showSelection,
            hideSelection
        };
    })();
    let objectWinner = (function() {        
        let displaywinner=document.createElement('div');        
        displaywinner.classList.add('displaywinner', 'winnerhide');
        text1=document.createElement('div');
        text1.textContent="Congratulations!";
        text1.classList.add('winnertitle');
        text2=document.createElement('div');
        text2.textContent="wins the game!";
        let winnername=document.createElement('div'); 
        winnername.classList.add('winnername');
        let okbutton=document.createElement('button');
        okbutton.classList.add('okbutton');
        okbutton.textContent="OK";
        okbutton.addEventListener('click',winnerokbutton);
        displaywinner.appendChild(text1);
        displaywinner.appendChild(winnername);
        displaywinner.appendChild(text2);
        displaywinner.appendChild(okbutton);
        
        // applyBackdrop();
        // hasStarted=false;
        
        
        function attachWinner() {
            container.appendChild(displaywinner);
        }
        function dispalyWinner() {
            displaywinner.classList.remove('winnerhide');
        }
        function hideWinner() {
            displaywinner.classList.remove('winnerhide');
        }
        function winnerName(who){
            winnername.textContent=who;
        }
        function eraseWinner(){
            winnername.textContent='';
        }
        let winnerokbutton=function() {
            hideWinner();
            resetgame();
            removeBackdrop();
            objectScore.reset();            
        }
        // --------------------
        return {
            attachWinner,
            dispalyWinner,
            hideWinner,
        }
    })();
    let mainApp=(function() {
        let gamearray=[];
        let player1=undefined;
        let player2=undefined;
        let hasStarted=false;
        let currentPlayer=0;
        // ----
        let displayApp = function() {
            let board=document.createElement('div');   
            let backdrop=document.createElement('div');
            backdrop.classList.add('backdrop', 'backdroptoggle');     
            board.classList.add('board');
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    let cell=document.createElement('div');
                    cell.classList.add('cell');
                    board.appendChild(cell);
                    cell.i=i;
                    cell.j=j;
                    cell.addEventListener('click',makemove);
                    cell.addEventListener('mouseover',hoverin);
                    cell.addEventListener('mouseout',hoverout);
                }            
            }
        };             
        let attachApp=function() {
            container.appendChild(backdrop);
            container.appendChild(board);
        };
        let player=function(name, team,id){
            // ------ return ------
            return {name, team,id};
        }
        //Make the game start by initializing the array
        let gamestart=function(){
            for(let i=0;i<3;i++) {
                gamearray.push([]);
                for(let j=0;j<3;j++){
                    gamearray[i].push('');
                }
            }
            hasStarted=true;              
            //Create player objects
            let name1=objectSelection.getname(1);
            let name2=objectSelection.getname(1);
            player1=player(name1 || "Player1","X",1);
            player2=player(name2 || "Player2","O",2);
            removeSelection();
            removeBackdrop();
            currentPlayer=player1;        
            objectScore.setText(currentPlayer.name+', your turn');
            let cursor=document.querySelector('.board');
            cursor.classList.remove('boardO');      
            cursor.classList.add('boardX');
        }
        //Reset the game
        let resetgame=function(){
            if(!hasStarted)return;
            gamearray=[];
            let cells=document.querySelector('.board').childNodes;
            cells.forEach(x=>{
                x.textContent="";
                x.classList="cell";
            });            
            let start=document.querySelector('.buttonstart');
            start.addEventListener('click',showSelection);
            let gb=document.querySelector('.board');        
            gb.classList.remove('boardX','boardO');
        }
        //Change current player
        let taketurn=function(){
            currentPlayer===player1 ? currentPlayer=player2 : currentPlayer=player1;
            objectScore.setText(currentPlayer.name+ ", your turn.");
            let cursor=document.querySelector('.board');
            if(cursor.classList.contains('boardX')){
                cursor.classList.add('boardO');
                cursor.classList.remove('boardX');
            }
            else {
                cursor.classList.add('boardX');
                cursor.classList.remove('boardO');
            }
        }
        //Display moves & update array
        let makemove=function(e) {
            if(!hasStarted){
                objectControls.hintStart();
                return;
            }
            let target=e.currentTarget;
            let currentcell=gamearray[target.i][target.j];
            if(!currentcell) {
                target.classList.add('player'+currentPlayer.id)
                gamearray[target.i][target.j]=currentPlayer.id;
                target.textContent=currentPlayer.team;            
                let check=checkwin();
                if(check>0){
                    displayWinner(currentPlayer.name);
                    e.currentTarget.classList.remove('boardHover');
                    return;
                }
                taketurn();
                e.currentTarget.classList.remove('boardHover');
            }
        }
        //Check winning condition
        let checkwin=function() {
            //rows
            if(gamearray[0][0]===1 && gamearray[0][1]===1 && gamearray[0][2]===1)return 1;
            if(gamearray[0][0]===2 && gamearray[0][1]===2 && gamearray[0][2]===2)return 2;
            if(gamearray[1][0]===1 && gamearray[1][1]===1 && gamearray[1][2]===1)return 1;
            if(gamearray[1][0]===2 && gamearray[1][1]===2 && gamearray[1][2]===2)return 2;
            if(gamearray[2][0]===1 && gamearray[2][1]===1 && gamearray[2][2]===1)return 1;
            if(gamearray[2][0]===2 && gamearray[2][1]===2 && gamearray[2][2]===2)return 2;
            //columns
            if(gamearray[0][0]===1 && gamearray[1][0]===1 && gamearray[2][0]===1)return 1;
            if(gamearray[0][0]===2 && gamearray[1][0]===2 && gamearray[2][0]===2)return 2;
            if(gamearray[0][1]===1 && gamearray[1][1]===1 && gamearray[2][1]===1)return 1;
            if(gamearray[0][1]===2 && gamearray[1][1]===2 && gamearray[2][1]===2)return 2;
            if(gamearray[0][2]===1 && gamearray[1][2]===1 && gamearray[2][2]===1)return 1;
            if(gamearray[0][2]===2 && gamearray[1][2]===2 && gamearray[2][2]===2)return 2;
            //diags
            if(gamearray[0][0]===1 && gamearray[1][1]===1 && gamearray[2][2]===1)return 1;
            if(gamearray[0][0]===2 && gamearray[1][1]===2 && gamearray[2][2]===2)return 2;
            if(gamearray[0][2]===1 && gamearray[1][1]===1 && gamearray[2][0]===1)return 1;
            if(gamearray[0][2]===2 && gamearray[1][1]===2 && gamearray[2][0]===2)return 2;
            return 0;
        }
        // ------------------------
        return {
            attachApp,
            displayApp,
            resetgame,
            gamestart,
            taketurn,
            checkwin,
            makemove,
        }
    })();

    let objectScore = {
        scoreEle:'',
        initObject:function(){
            let score=document.createElement('div'); 
            score.classList.add('score');
            let scoretext=document.createElement('div'); 
            scoretext.classList.add('scoretext');
            scoretext.id="scoretext";        
            score.appendChild(scoretext);
            let container=document.querySelector('.container');
            container.appendChild(score);
            
        },
        getEle:function(){
            let scroll=document.querySelector('#scoretext');
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
        reset() {
            this.getEle();
            this.addAnimation();
            this.setText('Press Start to play the game!');
        }
    }

    function applyBackdrop() {
        let b=document.querySelector('.backdrop');
        b.classList.remove('backdroptoggle'); 
    }
    function removeBackdrop() {
        let b=document.querySelector('.backdrop');
        b.classList.add('backdroptoggle'); 
    }
    
    
    function hoverin(e){
        if(e.currentTarget.innerHTML==='' && hasStarted)e.currentTarget.classList.add('boardHover');
    }
    function hoverout(e){
        e.currentTarget.classList.remove('boardHover');
    }

    // ----- private vars above this line -----
    return {
        displayboard,
        gamearray,
        gamestart,
        resetgame
    };
})();


gameboard.displayboard();
let board = document.querySelector('.board');
document.body.appendChild(container);

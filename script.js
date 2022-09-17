let title=document.querySelector('.texttitle');
title.classList.add('animate__bounceInLeft','.animate__animated.animate__infinite');
let container=document.createElement('div');  
container.classList.add('container'); 

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
            text1.textContent='Choose your opponent:';
            let row=document.createElement('div');
            row.classList.add('row');
            let cont1=document.createElement('div');
            let human=document.createElement('img');
            let p1name=document.createElement('div');
            let cont2=document.createElement('div');
            let ai=document.createElement('img');
            let p2name=document.createElement('div');
            p1name.textContent='Human';
            p2name.textContent='Xan';
            cont1.classList.add('cont1');
            cont2.classList.add('cont1');
            p1name.classList.add('opponenttype');
            p2name.classList.add('opponenttype');
            human.id="img1";
            ai.id="img2";
            human.addEventListener('click',objectSelection.highlightplayer);
            ai.addEventListener('click',objectSelection.highlightplayer);
            human.setAttribute('src','human.webp');
            ai.setAttribute('src','xan.webp');
            human.setAttribute('draggable','false');
            ai.setAttribute('draggable','false');
            cont1.appendChild(human);
            cont1.appendChild(p1name);
            cont2.appendChild(ai);
            cont2.appendChild(p2name);
            row.appendChild(cont1);
            row.appendChild(cont2);
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
            go.addEventListener('click',objectSelection.hintplayer);
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
            if(n===2){
                if(mainApp.opponent==='xan')return 'Xan';
                else return textName2.value;
            }
        },
        
        highlightplayer:function(p){
            let p1=container.querySelector('#img1');
            let p2=container.querySelector('#img2');
            if(p==='erase'){
                p2.classList.remove('imgselect');
                p1.classList.remove('imgselect');
                return;
            }
            if(p.currentTarget.id==='img1'){
                p1.classList.add('imgselect');
                p2.classList.remove('imgselect');
                mainApp.opponent='human';
                objectSelection.enableinput();
            }
            if(p.currentTarget.id==='img2'){
                p1.classList.remove('imgselect');
                p2.classList.add('imgselect');
                mainApp.opponent='xan';
                objectSelection.disableinput();
            }            
        },
        hintplayer(){            
            let p1=container.querySelector('#img1');
            let p2=container.querySelector('#img2');
            if(p1.classList.contains('hvr-pulse-grow') ||p2.classList.contains('hvr-pulse-grow')){
                p1.classList.remove('hvr-pulse-grow');
                p2.classList.remove('hvr-pulse-grow');
                setTimeout(e=>{
                    p1.classList.add('hvr-pulse-grow');
                    p2.classList.add('hvr-pulse-grow');
                },10);
            }
            else {
                p1.classList.add('hvr-pulse-grow');
                p2.classList.add('hvr-pulse-grow');
            }
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
        disableinput:function(){
            let inp=container.querySelector('#player2');
            inp.disabled=true;
            inp.value='';
            inp.placeholder='';
        },
        enableinput:function(){
            let inp=container.querySelector('#player2');
            inp.disabled=false;
            inp.value='';
            inp.placeholder='Player2';
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
            objectSelection.highlightplayer('erase');
        },
    };
    let objectWinner = {              
        attachWinner:function() {
            let displaywinner=document.createElement('div');        
            displaywinner.classList.add('displaywinner', 'winnerhide');
            let winnertext1=document.createElement('div');
            winnertext1.classList.add('winnertext');
            winnertext1.textContent="Congratulations!";            
            winnertext1.classList.add('winnertitle');
            let winnertext2=document.createElement('div');
            winnertext2.textContent="wins the game!";
            winnertext2.id='finalword';
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
            let winnertext1=container.querySelector('.winnertext');
            if(mainApp.currentPlayer.id===2 && mainApp.opponent==='xan')winnertext1.textContent="Uh Oh!!";
            else winnertext1.textContent="Congratulations!"; 
            let displaywinner=container.querySelector('.displaywinner'); 
            objectWinner.winnerName(mainApp.currentPlayer.name);
            displaywinner.classList.add('displaywinnerIn');
            displaywinner.classList.remove('displaywinnerOut');
            let finalword=container.querySelector('#finalword');
            finalword.textContent='wins the game!';
            applyBackdrop();
            displaywinner.classList.remove('winnerhide');
        },
        displayDraw:function() {
            let winnertext1=container.querySelector('.winnertext');
            winnertext1.textContent="It's a tie!"; 
            let displaywinner=container.querySelector('.displaywinner'); 
            displaywinner.classList.add('displaywinnerIn');
            displaywinner.classList.remove('displaywinnerOut');
            objectWinner.eraseWinner();
            let finalword=container.querySelector('#finalword');
            finalword.textContent='';
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
        opponent:'',        
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
                    let celloutline=document.createElement('div');
                    cell.classList.add('cell');
                    cell.classList.add('cellshadow');
                    cell.classList.add(`c${i}${j}`);
                    cell.appendChild(span);
                    cell.appendChild(celloutline);
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
            if(mainApp.opponent==='')return;
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
            mainApp.totalmoves=0;
            mainApp.gamearray=[];
            let cells=container.querySelector('.board').childNodes;
            cells.forEach(x=>{
                x.firstElementChild.textContent="";
                x.classList.remove('player1','player2','animateCell');
            });            
            let start=container.querySelector('.buttonstart');
            start.addEventListener('click',objectSelection.showSelection);
            let gb=container.querySelector('.board');        
            gb.classList.remove('boardX','boardO');
            objectScore.reset();
            mainApp.opponent='';
        },
        //Change current player
        taketurn:function(){
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
            if(mainApp.opponent==='xan'&&mainApp.currentPlayer===player2){
                bestMove();
            }
        },
        //Display moves & update array
        makemove:function(e) {
            if(!mainApp.hasStarted){
                objectControls.hintStart();
                return;
            }
            let target;
            if(mainApp.opponent==='human' || mainApp.currentPlayer.id===1){
                target=e.currentTarget;
            }
            else {
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
                    if(mainApp.opponent==='human')e.currentTarget.classList.remove('boardHover');
                    return;
                }
                if(check===-1){
                    objectWinner.displayDraw();
                    return;
                }
                mainApp.taketurn(false);
                if(mainApp.opponent==='human')e.currentTarget.classList.remove('boardHover');
            }
        },
        //Check winning condition
        checkwin:function() {            
            //rows
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[0][1]===1 && mainApp.gamearray[0][2]===1){mainApp.animateWin('row',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[0][1]===2 && mainApp.gamearray[0][2]===2){mainApp.animateWin('row',0);return 2;};
            if(mainApp.gamearray[1][0]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[1][2]===1){mainApp.animateWin('row',1);return 1;};
            if(mainApp.gamearray[1][0]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[1][2]===2){mainApp.animateWin('row',1);return 2;};
            if(mainApp.gamearray[2][0]===1 && mainApp.gamearray[2][1]===1 && mainApp.gamearray[2][2]===1){mainApp.animateWin('row',2);return 1;};
            if(mainApp.gamearray[2][0]===2 && mainApp.gamearray[2][1]===2 && mainApp.gamearray[2][2]===2){mainApp.animateWin('row',2);return 2;};
            //columns
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[1][0]===1 && mainApp.gamearray[2][0]===1){mainApp.animateWin('col',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[1][0]===2 && mainApp.gamearray[2][0]===2){mainApp.animateWin('col',0);return 2;};
            if(mainApp.gamearray[0][1]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][1]===1){mainApp.animateWin('col',1);return 1;};
            if(mainApp.gamearray[0][1]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][1]===2){mainApp.animateWin('col',1);return 2;};
            if(mainApp.gamearray[0][2]===1 && mainApp.gamearray[1][2]===1 && mainApp.gamearray[2][2]===1){mainApp.animateWin('col',2);return 1;};
            if(mainApp.gamearray[0][2]===2 && mainApp.gamearray[1][2]===2 && mainApp.gamearray[2][2]===2){mainApp.animateWin('col',2);return 2;};
            //diags
            if(mainApp.gamearray[0][0]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][2]===1){mainApp.animateWin('diag1',0);return 1;};
            if(mainApp.gamearray[0][0]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][2]===2){mainApp.animateWin('diag1',0);return 2;};
            if(mainApp.gamearray[0][2]===1 && mainApp.gamearray[1][1]===1 && mainApp.gamearray[2][0]===1){mainApp.animateWin('diag2',0);return 1;};
            if(mainApp.gamearray[0][2]===2 && mainApp.gamearray[1][1]===2 && mainApp.gamearray[2][0]===2){mainApp.animateWin('diag2',0);return 2;};
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
        let targethover=e.currentTarget.querySelector('div');
        let targetfill=e.currentTarget.firstElementChild;
        if(targetfill.innerHTML==='' && mainApp.hasStarted) {
            targethover.classList.add('boardHover');
        }
    }
    function hoverout(e){
        let targethover=e.currentTarget.querySelector('div');
        let targetfill=e.currentTarget.firstElementChild;
        if(mainApp.hasStarted) {
            targethover.classList.remove('boardHover');
        }    
    }
    let initialize=function(){
        objectScore.attachScore();
        objectScore.reset();
        mainApp.attachBoard();
        objectControls.attachControls();
        objectSelection.attachSelection();
        objectWinner.attachWinner(); 
        document.body.appendChild(container);
    }
    let getBoard=function(){
        return mainApp.gamearray;
    }
    let makeMove=function(m){
        mainApp.makemove(m);
    }
    // ----------
    return {
        initialize,
        getBoard,
        makeMove,
    };
})();

gameboard.initialize();

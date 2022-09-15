const gameController = (() => {
    let turn = 0;
    let result = "";
    let playerOne = "";
    let playerTwo = "";
  
    // set player names if game for two players
    const setPlayerNames = (form) => {
      playerOne = playerFactory(form.elements["player-one"].value, "X");
      playerTwo = playerFactory(form.elements["player-two"].value, "O");
    };
  
    // set player name if game with AI
    const setPlayerName = (form) => {
      playerOne = playerFactory(form.elements["player-one"].value, "X");
      playerTwo = playerFactory("AI", "O");
    };
  
    // helper function for random number generation in range 0 to 8
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 9);
    };
  
    // generate random number and check if array is empty for that index
    const generateRandomMove = (array) => {
      let choice = generateRandomNumber();
      while (array[choice] !== "") {
        choice = generateRandomNumber();
      }
      return choice;
    };
  
    // create a snapshot of current array
    const getCurrentArrayState = (array) => {
      return array.map((element, index) => (element ? element : index));
    };
  
    // create an array of available moves
    const getEmptyArrayIndexes = (array) => {
      return array.filter((element) => element !== "X" && element !== "O");
    };
  
    // return best move available with help of minimax algorithm
    const minimax = (array, passedMark) => {
      const humanMark = "X";
      const aiMark = "O";
      // store current array state with empty places switched to indexes of that places
      const currentArrayState = getCurrentArrayState(array);
  
      // create an array of available moves
      const availableMoves = getEmptyArrayIndexes(currentArrayState);
      // keep log of each trial run
      const trialRunLogs = [];
  
      // console.log(availableMoves.length);
  
      // check for terminal state - if any player won or if it is a tie
      if (checkForWinningCombination(currentArrayState, humanMark)) {
        return { score: -1 };
      } else if (checkForWinningCombination(currentArrayState, aiMark)) {
        return { score: 1 };
      } else if (availableMoves.length === 0) {
        return { score: 0 };
      }
  
      // loop through each available move and test outcome of that move
      for (let i = 0; i < availableMoves.length; i++) {
        // store log of this trial run
        const trialRun = {};
        // store current index
        trialRun.index = currentArrayState[availableMoves[i]];
        currentArrayState[availableMoves[i]] = passedMark;
  
        // check what has changes since move was taken and run function recursively
        if (passedMark === aiMark) {
          const result = minimax(currentArrayState, humanMark);
          trialRun.score = result.score;
        } else {
          const result = minimax(currentArrayState, aiMark);
          trialRun.score = result.score;
        }
        // revert changes
        currentArrayState[availableMoves[i]] = trialRun.index;
        // append the result of the trial run to the trialRunLogs
        trialRunLogs.push(trialRun);
      }
  
      // create a store most successful trial run reference
      let bestTrialRun = null;
  
      // get the reference to the best trial run
      if (passedMark === aiMark) {
        let bestScore = -Infinity;
        for (let i = 0; i < trialRunLogs.length; i++) {
          if (trialRunLogs[i].score > bestScore) {
            bestScore = trialRunLogs[i].score;
            bestTrialRun = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < trialRunLogs.length; i++) {
          if (trialRunLogs[i].score < bestScore) {
            bestScore = trialRunLogs[i].score;
            bestTrialRun = i;
          }
        }
      }
  
      // return index of best trial run for the current player - maximize for AI, minimize for human
      return trialRunLogs[bestTrialRun];
    };
  
    // main logic of game round with human
    const playWithHuman = (array, board) => {
      displayController.commentary.textContent = `Choose wisely your move`;
  
      board.forEach((spot) =>
        spot.addEventListener("click", () => {
          // check if spot is already taken
          if (spot.textContent) {
            return;
            // if not taken then take it!
          } else {
            // playerOne's turn
            if (turn % 2 == 0) {
              array[board.indexOf(spot)] = playerOne.mark;
              if (checkForWinningCombination(array, playerOne.mark)) {
                result = playerOne.name;
              }
              displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
              console.log(turn);
              // playerTwo's turn
            } else {
              array[board.indexOf(spot)] = playerTwo.mark;
              if (checkForWinningCombination(array, playerTwo.mark)) {
                result = playerTwo.name;
              }
              displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
              console.log(turn);
            }
            displayController.render(array, board);
  
            // check if for winner of if it is a tie
            evaluateResult(result, array);
            turn++;
          }
        })
      );
    };
  
    // main logic of game round with AI
    const playWithAI = (array, board) => {
      displayController.commentary.textContent = `Choose wisely your move`;
  
      board.forEach((spot) =>
        spot.addEventListener("click", () => {
          // check if spot is already taken
          if (spot.textContent) {
            return;
            // if not taken then take it!
          } else {
            // playerOne's turn
            displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
            array[board.indexOf(spot)] = playerOne.mark;
            if (checkForWinningCombination(array, playerOne.mark)) {
              result = playerOne.name;
            }
            turn++;
            displayController.render(array, board);
  
            if (evaluateResult(result, array)) {
              return;
            } else {
              // AI's turn
              // create effect of AI's thinking
              setTimeout(() => {
                array[minimax(array, playerTwo.mark).index] = playerTwo.mark;
                // array[generateRandomMove(array)] = playerTwo.mark;
  
                if (checkForWinningCombination(array, playerTwo.mark)) {
                  result = playerTwo.name;
                }
                displayController.render(array, board);
                displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
                turn++;
                evaluateResult(result, array);
              }, 500);
            }
          }
        })
      );
    };
  
    // check if the game has been won or tied
    const evaluateResult = (result, array) => {
      if (result) {
        resetTurn();
        displayController.writeToModal(`Winner is ${result}`);
        displayController.toggleModal();
        return true;
      } else if (!array.some((spot) => spot === "")) {
        resetTurn();
        displayController.writeToModal(`It's a tie!`);
        displayController.toggleModal();
        return true;
      }
      return false;
    };
  
    // check all possibilities if last player's move was a winning one
    const checkForWinningCombination = (array, mark) => {
      //check rows
      for (let i = 0; i < 9; i = i + 3) {
        if (array[i] === mark) {
          if (array[i] === array[i + 1] && array[i + 1] === array[i + 2]) {
            return true;
          }
        }
      }
      // check columns
      for (let i = 0; i < 3; i++) {
        if (array[i] === mark) {
          if (array[i] === array[i + 3] && array[i + 3] === array[i + 6]) {
            return true;
          }
        }
      }
      // check diagonal
      if (array[0] === mark) {
        if (array[0] === array[4] && array[4] === array[8]) {
          return true;
        }
      }
      // check anti-diagonal
      if (array[2] === mark) {
        if (array[2] === array[4] && array[4] === array[6]) {
          return true;
        }
      }
      return false;
    };
  
    const resetTurn = () => {
      turn = 0;
      result = "";
    };
  
    return {
      setPlayerNames,
      setPlayerName,
      playWithHuman,
      playWithAI,
      resetTurn,
    };
  })();
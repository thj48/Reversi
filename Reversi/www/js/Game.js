//alert("game");
function Game() {
	"use strict";
	
	var board = new Board();
	var player1 = new Player();
	var player2 = new Player();
	var currentPlayer;
	
	
	/**
	 * finished? 
	 */
	this.start = function() {
		player1.setSymbol("X");
		player2.setSymbol("O");
		
		currentPlayer = player1;
	};    
    
    this.startNewGame = function(isPlayingAgainstComputer) {
		board.resetSquares();
        player2.setIsAComputer(isPlayingAgainstComputer);
        
        this.start();
        
		$.publish('resetBoardEvent');
        $.publish('resetScoreFieldsEvent');
		this.setupCenterBoard();
	};
	
	/**
	 * finished 
	 */
	this.takeATurn = function(squareIndex) {        
		
        var isAValidMove = this.isAValidReversiMove(squareIndex);
		
		if(isAValidMove) {
			board.setSquareOccupied(squareIndex, currentPlayer.getPlayerSymbol());
            //flip pieces
            this.flipCapturedPieces(squareIndex);
			this.switchPlayers();
           
            $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);	
            //calls handleCellClickedEvent in grid which updates the view.	
            
        } else {
            //Should we take out? Maybe inform them a different way?
			//alert("Please make a valid move.");
		}		
        
        if(isAValidMove && currentPlayer == player2 && player2.isAComputer()) {
            //if the human made a move and it is player2's turn and player2 is a computer.
            
            this.performMoveForComputerPlayer();
            
            this.switchPlayers();
        }
		
        $.publish('playerOnePointUpdateEvent', [this.getPlayerOnePoints()]);
        $.publish('playerTwoPointUpdateEvent', [this.getPlayerTwoPoints()]);
        
        this.handleLackOfValidMoves();
        
		if (board.isAllFilledIn() || !this.isThereAValidMoveLeft()) {			
			this.initializeEndOfGameSequence();
		}		
	};
    
     this.handleLackOfValidMoves = function() { //todo
        var stillProcessing = true;
        
       do {
           if (!this.isThereAValidMoveLeft()) {
               stillProcessing = false; //break out because the game is at an end
           } else if (!currentPlayer.isAComputer() && !this.hasValidMoveToMake() && player2.isAComputer()) {
               this.switchPlayers(); //switches to computer
               this.performMoveForComputerPlayer();
               this.switchPlayers(); //switches back to human, retest
           } else if (!currentPlayer.isAComputer() && this.hasValidMoveToMake()) { 
                stillProcessing = false;
           } else if (currentPlayer.isAComputer() && !this.hasValidMoveToMake()) {
                this.switchPlayers();   
           }         
           
       } while (stillProcessing);
        
    };
    
    
    this.isThereAValidMoveLeft = function() { //todo
        
        
        //has to check is a valid move with the current player
        //then switch and check with the other player
        //and then switch back to the original one before
        //leaving this method.
        
        if (this.hasValidMoveToMake()) {
            return true;
        }
            
        this.switchPlayers();
        
        if (this.hasValidMoveToMake()) {
            this.switchPlayers();
            return true;
        }
        
        this.switchPlayers();
        return false;        
        
    };
    
    // my ai code.
    
    this.performMoveForComputerPlayer = function() {
        //can the computer make a valid move
        var hasValidMoveToMake = this.hasValidMoveToMake();
        
        if(hasValidMoveToMake) {
            //find all available moves by square index (value).
            var possibleMoves = this.getListOfAllPossibleMoves(); //by value not corridiants
            
            //put them in a list
            //go through that list one by one and detemine which one will take
                //the most peices.
            possibleMoves = this.reorderPossibleMovesInARandomWay(possibleMoves); //todo: finish implementing this
            
            //go through the list again and find out if any of the available
                //moves are corner spaces.
                    //if the are put them into a list
            var cornerPlaces = this.getListOfAvailableCornerPlaces(possibleMoves);
            //if there are any corner spaces it should take the first one
            //else it should take the square in the other list with the most
            //points.
            var squareIndexOfMove = this.getSquareIndexOfComputerMove(possibleMoves, cornerPlaces);
            
            //set that square to occupied.
            board.setSquareOccupied(squareIndexOfMove, currentPlayer.getPlayerSymbol());
            this.flipCapturedPieces(squareIndexOfMove);
           
            $.publish('cellClickedEvent', [squareIndexOfMove, board.getSymbolFromSquare(squareIndexOfMove)]);
            //flip all captured pieces
        }
        
    };
    
    this.getSquareIndexOfComputerMove = function(possibleMoves, cornerPlaces) {
        if (cornerPlaces.length == 0) { //not sure this works, is length the number of objects in it?
            return possibleMoves[0];
        } else {
            return cornerPlaces[0];   
        }
    };
    
    this.getListOfAvailableCornerPlaces = function(possibleMoves) {
        var topLeftCorner = 0;
        var topRightCorner = 7;
        var bottomLeftCorner = 56;
        var bottomRightCorner = 63;
        
        var cornerPlaces = new Array();
        var index = 0;
        
        for(var i = 0; i < possibleMoves.length; i++) {
            if(possibleMoves[i] == topLeftCorner) {
                cornerPlaces[index] = possibleMoves[i];
                index++;                
            } else if(possibleMoves[i] == topRightCorner) {
                cornerPlaces[index] = possibleMoves[i];
                index++;
            } else if(possibleMoves[i] == bottomLeftCorner) {
                cornerPlaces[index] = possibleMoves[i];
                index++;
            } else if(possibleMoves[i] == bottomRightCorner) {
                cornerPlaces[index] = possibleMoves[i];
                index++;
            }
        }
        
        return cornerPlaces;
    }; 
    
    this.reorderPossibleMovesInARandomWay = function(possibleMoves) { //todo: finish implementing this
        
        //var random = get ranom number from range 0 - 10, later this can be used to implement
        //how hard or easy the game is by determining whether or not the list of
        //possible moves gets arranged according to most pieces capturable or by
        //the index values from greatest to least.
        
        
        //list of ints representing index values 0 - 63 of possible moves on the board. possibleMoves
        
        //for each item in the list go through all 8 different possible directions and
        //add up the number of capturable pieces.
        
        var random = Math.floor(Math.random() * 11);
        var difficultyLevel = 5;
        
        if (difficultyLevel < random) {
            
            for(var i = 0; i < possibleMoves.length; i++) {
                for(var j = 0; j < possibleMoves.length - 1; j++) {
                    var currSquare = this.getNumberOfCapturablePiecesFromLocation(possibleMoves[j]);
                    var nextSquare = this.getNumberOfCapturablePiecesFromLocation(possibleMoves[j + 1]);
                                                                              
                    if(currSquare < nextSquare) {
                        var temp = possibleMoves[j];
                        possibleMoves[j] = possibleMoves[j + 1];
                        possibleMoves[j + 1] = temp;
                    }             
                }                
            }            
        } else {
            
            //this orders them according to their indexValue not the number of captures.        
            for(var i = 0; i < possibleMoves.length; i++) {
                for(var j = 0; j < possibleMoves.length - 1; j++) {
                    if(possibleMoves[j] < possibleMoves[j + 1]) {
                        var temp = possibleMoves[j];
                        possibleMoves[j] = possibleMoves[j + 1];
                        possibleMoves[j + 1] = temp;
                    }            
                }     
            }
            
        }
        
        return possibleMoves;
        
    };
    
    this.getListOfAllPossibleMoves = function() {
        var possibleMoves = new Array(); //stored as squareIndex (int) values not references to squares.
        
        var index = 0;
        for(var squareIndex = 0; squareIndex < 64; squareIndex++) {
            if(this.isAValidReversiMove(squareIndex)) {
                possibleMoves[index] = squareIndex;
                index++;
            }
        }        
        
        return possibleMoves;
    };
    
    this.hasValidMoveToMake = function() {
        for(var squareIndex = 0; squareIndex < 64; squareIndex++) {
            if(this.isAValidReversiMove(squareIndex)) {
                return true;
            }
        }  
        
        return false;
        
    };
    
    // central nervous system of ai, determines number of pieces capturable at a
    //given location
    
    //squareIndex is a valid move location, it is an int 0 - 63
    this.getNumberOfCapturablePiecesFromLocation = function(squareIndex) {
        var numberOfCapturablePieces;
        
        //todo implement this. get number of pieces from each directions
        //and add them up.
        var startingSquare = board.getSquareWithValue(squareIndex);
        var startingRow = startingSquare.getRow();
        var startingColumn = startingSquare.getColumn();
       
        var rightCount = this.getRightCountCapturablePieces(startingRow, startingColumn); 
        var downRightCount = this.getDownRightCountCapturablePieces(startingRow, startingColumn);
        var downCount = this.getDownCountCapturablePieces(startingRow, startingColumn);
        var leftDownCount = this.getLeftDownCountCapturablePieces(startingRow, startingColumn);
        var leftCount = this.getLeftCountCapturablePieces(startingRow, startingColumn);
        var leftUpCount = this.getLeftUpCountCapturablePieces(startingRow, startingColumn);
        var upCount = this.getUpCountCapturablePieces(startingRow, startingColumn);
        var rightUpCount = this.getRightUpCountCapturablePieces(startingRow, startingColumn);
        
        numberOfCapturablePieces = rightCount + downRightCount + downCount + leftDownCount + leftCount + leftUpCount + upCount + rightUpCount;        
        
        return numberOfCapturablePieces;
    };
    
    this.getRightCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingColumn + 1; i < squares.length; i++) { //if there is a right square go there
            
            if(squares[startingRow][i].isSquareEmpty()) {
                
                i = squares.length; //if the square to the right is empty the causes the for loop to stop.
                    //if the square is not empty...
            } else if (squares[startingRow][i].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                //in here is where the player symbol is not the same. this is a good thing.
                squaresTraversed++;
            } else if (squares[startingRow][i].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                    //return true;
                } else {

                    i = squares.length;
                }
            }
        } //end of for loop
        
        return 0;
        
    };
    
    this.getDownRightCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow + 1;
        var column = startingColumn + 1;
        
        while (row < squares.length && column < squares.length) {
            
            if(squares[row][column].isSquareEmpty()) {
                return 0;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    row = squares.length;
                }
            }
            
            row++;
            column++;
        } //end of while loop
        
        return 0;
    };
    
    this.getDownCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingRow + 1; i < squares.length; i++) {            
            if(squares[i][startingColumn].isSquareEmpty()) {
                return 0;
            } else if (squares[i][startingColumn].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){                
                squaresTraversed++;
            } else if (squares[i][startingColumn].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else { //not sure about this else statement
                    i = squares.length;
                }
            }
        } //end of for loop
        
        return 0;
    };
    
    this.getLeftDownCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow + 1; //plus one makes it go down the array squares in Board, remember? this is right trust me.
        var column = startingColumn - 1;
        
        while (row < squares.length && column > -1) {            
            if(squares[row][column].isSquareEmpty()) {
                return 0;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){                
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    row = squares.length;
                }
            }
            
            row++;
            column--;
        } //end of while loop
        
        return 0;
    };
    
    this.getLeftCountCapturablePieces = function(startingRow, startingColumn) { //done, might need fixing
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingColumn - 1; i > -1; i--) {            
            if(squares[startingRow][i].isSquareEmpty()) {
                return 0;
            } else if (squares[startingRow][i].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                squaresTraversed++;
            } else if (squares[startingRow][i].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    i = -1;
                }
            }
        } //end of for loop
        
        return 0;
    };
    
    this.getLeftUpCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow - 1;
        var column = startingColumn - 1;
        
        while (row > -1 && column > -1) {            
            if(squares[row][column].isSquareEmpty()) {
                return 0;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){                
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    row = -1;
                }
            }
            
            row--;
            column--;
        } //end of while loop
        
        return 0;
    };
    
    this.getUpCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingRow - 1; i > -1; i--) {
            
            if(squares[i][startingColumn].isSquareEmpty()) {
                return 0;
            } else if (squares[i][startingColumn].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                squaresTraversed++;
            } else if (squares[i][startingColumn].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    return 0;
                }
            }
        }
        
        return 0;
    };
    
    this.getRightUpCountCapturablePieces = function(startingRow, startingColumn) { //done
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow - 1;
        var column = startingColumn + 1;
        
        while (row > -1 && column < squares.length) {            
            if(squares[row][column].isSquareEmpty()) {
                return 0;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                if (squaresTraversed > 0) {
                    return squaresTraversed;
                } else {
                    return 0;
                }
            }
            
            row--;
            column++;
        } //end of while loop
        
        return 0;
    };
    
    
    
    
    
    
    
    //end of ai
    
    // the in between code
    // JAKE work below this line on the flipping methods
    
    this.flipCapturedPieces = function(squareIndex) {
        var startingSquare = board.getSquareWithValue(squareIndex);
        var startingRow = startingSquare.getRow();
        var startingColumn = startingSquare.getColumn();
                                
        if (this.isAValidRightMove(startingRow, startingColumn)) {
            this.flipRightPieces(startingRow, startingColumn);
        }
        if (this.isAValidDownRightMove(startingRow, startingColumn)) {
            this.flipDownRightPieces(startingRow, startingColumn);
        }
        if (this.isAValidDownMove(startingRow, startingColumn)) {
            this.flipDownPieces(startingRow, startingColumn);
        }
        if (this.isAValidDownLeftMove(startingRow, startingColumn)) {
           this.flipDownLeftPieces(startingRow, startingColumn);
        }
        if (this.isAValidLeftMove(startingRow, startingColumn)) {
            this.flipLeftPieces(startingRow, startingColumn);
        }
        if (this.isAValidUpLeftMove(startingRow, startingColumn)) {
            this.flipUpLeftPieces(startingRow, startingColumn);
        }
        if (this.isAValidUpMove(startingRow, startingColumn)) {
            this.flipUpPieces(startingRow, startingColumn);
        }
        if (this.isAValidUpRightMove(startingRow, startingColumn)) {
            this.flipUpRightPieces(startingRow, startingColumn);
        }  
    };
    
    this.flipRightPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var column = startingColumn + 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[startingRow][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[startingRow][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                column++;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipDownRightPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow + 1;
        var column = startingColumn + 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row++;
                column++;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipDownPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow + 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][startingColumn].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][startingColumn].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row++;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipDownLeftPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow + 1;
        var column = startingColumn - 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row++;
                column--;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipLeftPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var column = startingColumn - 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[startingRow][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[startingRow][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                column--;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipUpLeftPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow - 1;
        var column = startingColumn - 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row--;
                column--;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipUpPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow - 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][startingColumn].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][startingColumn].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row--;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    this.flipUpRightPieces = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var currentSymbol = squares[startingRow][startingColumn].getPlayerSymbol();
        var row = startingRow - 1;
        var column = startingColumn + 1;
        var flippingPieces = true;
        
        while(flippingPieces) {
            if (squares[row][column].getPlayerSymbol() !== currentSymbol) {
                
                var squareIndex = squares[row][column].getValue();
                
                board.setSquareOccupied(squareIndex, currentSymbol);
                $.publish('cellClickedEvent', [squareIndex, board.getSymbolFromSquare(squareIndex)]);
                
                row--;
                column++;
            } else {
                flippingPieces = false;
            }
        }
    };
    
    // end of flipping code
    
    // below is Jake's is valid code.
    
    this.isAValidReversiMove = function(squareIndex) {
        if (!board.isSquareEmpty(squareIndex)) {
            //alert("That square is already taken.");
            return false;   
        }        
        
        var startingSquare = board.getSquareWithValue(squareIndex);
        var startingRow = startingSquare.getRow();
        var startingColumn = startingSquare.getColumn();
                                
        if (this.isAValidRightMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidDownRightMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidDownMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidDownLeftMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidLeftMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidUpLeftMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidUpMove(startingRow, startingColumn)) {
            return true;
        } else if (this.isAValidUpRightMove(startingRow, startingColumn)) {
            return true;
        }
        
        return false;
    };
    
    this.isAValidRightMove = function(startingRow, startingColumn) { 
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingColumn + 1; i < squares.length; i++) {
            
            if(squares[startingRow][i].isSquareEmpty()) {
                
//                alert("right is empty");
                i = squares.length;
            } else if (squares[startingRow][i].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("right is other player");
                squaresTraversed++;
            } else if (squares[startingRow][i].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("right is valid move");
                    return true;
                } else {
//                    alert("right is same player");
                    i = squares.length;
                }
            }
        }
        
        return false;
    };
    
    this.isAValidDownRightMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow + 1;
        var column = startingColumn + 1;
        
        while (row < squares.length && column < squares.length) {
            
            if(squares[row][column].isSquareEmpty()) {
                
//                alert("downright is empty");
                row = squares.length;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("downright is other player");
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("downright is valid move");
                    return true;
                } else {
//                    alert("downright is same player");
                    row = squares.length;
                }
            }
            
            row++;
            column++;
        }
        
        return false;
    };
    
    this.isAValidDownMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingRow + 1;i < squares.length;i++) {
            
            if(squares[i][startingColumn].isSquareEmpty()) {
                
//                alert("down is empty");
                i = squares.length;
            } else if (squares[i][startingColumn].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("down is other player");
                squaresTraversed++;
            } else if (squares[i][startingColumn].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("down is valid move");
                    return true;
                } else {
//                    alert("down is same player");
                    i = squares.length;
                }
            }
        }
        
        return false;
    };
    
    this.isAValidDownLeftMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow + 1;
        var column = startingColumn - 1;
        
        while (row < squares.length && column > -1) {
            
            if(squares[row][column].isSquareEmpty()) {
                
//                alert("downleft is empty");
                row = squares.length;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("downleft is other player");
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("downleft is valid move");
                    return true;
                } else {
//                    alert("downleft is same player");
                    row = squares.length;
                }
            }
            
            row++;
            column--;
        }
        
        return false;
    };
    
    this.isAValidLeftMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingColumn - 1;i > -1;i--) {
            
            if(squares[startingRow][i].isSquareEmpty()) {
                
//                alert("left is empty");
                i = 0;
            } else if (squares[startingRow][i].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("left is other player");
                squaresTraversed++;
            } else if (squares[startingRow][i].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("left is valid move");
                    return true;
                } else {
//                    alert("left is same player");
                    i = -1;
                }
            }
        }
        
        return false;
    };
    
    this.isAValidUpLeftMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow - 1;
        var column = startingColumn - 1;
        
        while (row > -1 && column > -1) {
            
            if(squares[row][column].isSquareEmpty()) {
                
//                alert("upleft is empty");
                row = 0;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("upleft is other player");
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("upleft is valid move");
                    return true;
                } else {
//                    alert("upleft is same player");
                    row = -1;
                }
            }
            
            row--;
            column--;
        }
        
        return false;
    };
    
    this.isAValidUpMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        for(var i = startingRow - 1;i > -1;i--) {
            
            if(squares[i][startingColumn].isSquareEmpty()) {
                
//                alert("up is empty");
                i = -1;
            } else if (squares[i][startingColumn].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("up is other player");
                squaresTraversed++;
            } else if (squares[i][startingColumn].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("up is valid move");
                    return true;
                } else {
//                    alert("up is same player");
                    i = -1;
                }
            }
        }
        
        return false;
    };
    
    this.isAValidUpRightMove = function(startingRow, startingColumn) {
        var squares = board.getBoard();
        var squaresTraversed = 0;
        
        var row = startingRow - 1;
        var column = startingColumn + 1;
        
        while (row > -1 && column < squares.length) {
            
            if(squares[row][column].isSquareEmpty()) {
                
//                alert("upright is empty");
                row = -1;
            } else if (squares[row][column].getPlayerSymbol() !== currentPlayer.getPlayerSymbol()){
                
//                alert("upright is other player");
                squaresTraversed++;
            } else if (squares[row][column].getPlayerSymbol() == currentPlayer.getPlayerSymbol()){
                
                if (squaresTraversed > 0) {
//                    alert("upright is valid move");
                    return true;
                } else {
//                    alert("upright is same player");
                    row = -1;
                }
            }
            
            row--;
            column++;
        }
        
        return false;
    };
	
    
    this.sendScore = function(result, playerOnePoints) {
        var newAddition =","+result + "     "+playerOnePoints; 
        
        $.getJSON("http://tholt4.pythonanywhere.com/_sendScore", {
            input: newAddition
        },
        function(data) {});
        alert("message sent");
    };
    
    
	/**
	 * finished, should be private helper method.
	 */
	this.initializeEndOfGameSequence = function() {
        
        var playerOnePoints = this.getPlayerOnePoints();
        var playerTwoPoints = this.getPlayerTwoPoints();
        
        if (playerOnePoints > playerTwoPoints) {
            alert("Player 1 wins with " + playerOnePoints + " points!");
        } else if (playerTwoPoints > playerOnePoints) {
            alert("Player 2 wins with " + playerTwoPoints + " points!");
        } else {
            alert("Tie!");
        }
        
        if(player2.isAComputer() && playerOnePoints > 32){
            //alert("You've beat our mastermind computer!!! Enter your name to be in the hall of fame highscore!!");
            var result = prompt('Youve beat our mastermind computer!!! Enter your name to be in the hall of fame highscore!!', ' ');
            
            
            if((result==' ') || (result==null)){
                alert("anonymous");
                result = "Anonymous";
                this.sendScore(result, playerOnePoints);
            } else {
                alert("name" + result);
                this.sendScore(result, playerOnePoints);
            }
        }
        
	};
    
    this.getPlayerOnePoints = function() {
        var playerOnePoints = 0;
        
        for (var i = 0; i < 64; i++) {
		  if (board.getSymbolFromSquare(i) == "X") {
              playerOnePoints++;
            }
	    }
        
        return playerOnePoints;
    };
    
    this.getPlayerTwoPoints = function() {
        var playerTwoPoints = 0;
        
        for (var i = 0; i < 64; i++) {
		  if (board.getSymbolFromSquare(i) == "O") {
              playerTwoPoints++;
            }
	    }
        
        return playerTwoPoints;
    };
	
	/**
	 * 
	 */
	this.switchPlayers = function() {
		if (currentPlayer == player1) {
			currentPlayer = player2;
		} else {
			currentPlayer = player1;
		}
	};
			
	/**
	 * 
	 */
	this.getCurrentPlayer = function() {
		return currentPlayer;
	};
	
    
    this.setupCenterBoard = function() {
        board.setSquareOccupied(27, currentPlayer.getPlayerSymbol());
        this.switchPlayers();
        $.publish('cellClickedEvent', [27, board.getSymbolFromSquare(27)]);  
        
        board.setSquareOccupied(35, currentPlayer.getPlayerSymbol());
        this.switchPlayers();
        $.publish('cellClickedEvent', [35, board.getSymbolFromSquare(35)]); 
        
        board.setSquareOccupied(36, currentPlayer.getPlayerSymbol());
        this.switchPlayers();
        $.publish('cellClickedEvent', [36, board.getSymbolFromSquare(36)]);          
        
        board.setSquareOccupied(28, currentPlayer.getPlayerSymbol());
        this.switchPlayers();
        $.publish('cellClickedEvent', [28, board.getSymbolFromSquare(28)]);      
    };
	
	return this;
}

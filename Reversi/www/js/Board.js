//alert("board");
function Board() {
	"use strict";
	
	var squares = new Array();
    
    var row0 = new Array();
    var row1 = new Array();
    var row2 = new Array();
    var row3 = new Array();
    var row4 = new Array();
    var row5 = new Array();
    var row6 = new Array();
    var row7 = new Array();
    
    squares[0] = row0;
    squares[1] = row1;
    squares[2] = row2;
    squares[3] = row3;
    squares[4] = row4;
    squares[5] = row5;
    squares[6] = row6;
    squares[7] = row7;
    
	var squareValue = 0;
    
    
	for (var row = 0; row < 8; row++) {
        for(var column = 0; column < 8; column++) {
            squares[row][column] = new Square();
            squares[row][column].setValue(squareValue);   
            squares[row][column].setColumn(column);
            squares[row][column].setRow(row);
            squareValue++;
        }    		
	}
	
	/**
	 * finished
	 */
	this.setSquareOccupied = function(squareIndex, currentPlayerSymbol) {
        var square = this.getSquareWithValue(squareIndex);
        
		square.setPlayerSymbol(currentPlayerSymbol);
		square.setOccupied();
	};
	
	/**
	 * finished
	 */
	this.resetSquares = function() {
		for (var row = 0; row < 8; row++) {
            for(var column = 0; column < 8; column++) {
                squares[row][column].setEmpty();                
            }    		
        }
	};
	
	/**
	 * 
	 */
	this.getSymbolFromSquare = function(squareIndex) {
		var square = this.getSquareWithValue(squareIndex);
		
		return square.getPlayerSymbol();
	};
	
	/**
	 * finished
	 */
	this.isSquareEmpty = function(squareIndex) {
		
		var currentSquare = this.getSquareWithValue(squareIndex); //squares[squareIndex];
		
		return currentSquare.isSquareEmpty();
	};
    
    this.getSquareWithValue = function(squareIndex) {
        
        var square;
        
        for (var row = 0; row < 8; row++) {
            for(var column = 0; column < 8; column++) {
                if (squareIndex == squares[row][column].getValue()) {
                    square = squares[row][column];
                }
            }    		
	   }
        
        return square;
    }
	
	/**
	 * finished
	 */
	this.isAllFilledIn = function() {				
        for (var row = 0; row < 8; row++) {
            for(var column = 0; column < 8; column++) {
                if (squares[row][column].isSquareEmpty()) {
                    return false;
                }
            }    		
        }
		
		return true;
	};
	
	/**
	 *Unused, test method left over from when I started
	 * programming. Used to confirm that the board is populated.
	 */
	this.getBoard = function() {
		return squares;
	};
	
	
}

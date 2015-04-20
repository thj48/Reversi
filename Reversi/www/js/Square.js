//alert("square");
function Square() {
	"use strict";
	
	this.value; //number of square, can be 0 - 63, also might be called "squareIndex", placement of the square.
    this.row; //0 - 7
    this.column; //0 - 7
    
	var isEmpty = true;
	this.playerSymbol = " ";
	
	/**
	 * finished 
	 */
	this.setValue = function(squareValue) {
		this.value = squareValue;
	};
	
	/**
	 * finished
	 */
	this.getValue = function() {
        
		return this.value;
	};
    
    /**
	 * finished 
	 */
	this.setRow = function(rowValue) {
		this.row = rowValue;
	};
	
	/**
	 * finished
	 */
	this.getRow = function() {
		return this.row;
	};
	
	/**
	 * 
	 */
	this.setColumn = function(columnValue) {
		this.column = columnValue;
	};
	
	/**
	 * 
	 */
	this.getColumn = function() {
		return this.column;
	};
	
	/**
	 * 
	 */
	this.setOccupied = function() {
		isEmpty = false;
	};
	
	/**
	 * needs to clear the player symbol and set isEmpty to true.
	 */
	this.setEmpty = function() {
		//alert("Square.setEmpty");
		isEmpty = true;
		this.playerSymbol = " ";
	};
	
	/**
	 * not finished
	 * the use of this. might not be correct. 
	 */
	this.setPlayerSymbol = function(playerSymbol) {
		this.playerSymbol = playerSymbol;
	};
	
	/**
	 * 
	 */
	this.getPlayerSymbol = function() {
		return this.playerSymbol;
	};
	
	/**
	 * finished 
	 */
	this.isSquareEmpty = function() {
		//alert("Square.isSquareEmpty");
		return isEmpty;
	};
	
}
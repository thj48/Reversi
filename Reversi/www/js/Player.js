//alert("player");
function Player() {
	"use strict";
	
	this.symbol;
	this.boardSquares = new Array();
    this.isAComputerPlayer = false;
    
    
    this.setIsAComputer = function(isPlayerAComputer) {
        this.isAComputerPlayer = isPlayerAComputer;
    };
   
    this.isAComputer = function() {
        return this.isAComputerPlayer;  
    };
	
	/**
	 *  finished
	 */
	this.setSymbol = function(playerSymbol) {
		this.symbol = playerSymbol;
	};
	
	/**
	 * 
	 */
	this.getPlayerSymbol = function() {
		return this.symbol;
	};
	
	
	
}
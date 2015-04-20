/**
 * GameSpec represents a series of tests on Game objects.
 * 
 * @author Kenneth Weathington
 * @version Spring 2014
 */

describe("When taking turns", function() {
	"use strict";
	
	it("should determine a valid move", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		expect(testGame.isAValidReversiMove(34)).toBe(true);
	});
	
	it("should determine a valid move after moves have been made", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		testGame.takeATurn(34);
		testGame.takeATurn(26);
		testGame.takeATurn(19);
		
		expect(testGame.isAValidReversiMove(44)).toBe(true);
	});
	
	it("should determine an invalid move", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		expect(testGame.isAValidReversiMove(35)).toBe(false);
	});
});

describe("When counting capturable pieces", function() {
	"use strict";
	
	it("should determine the number of pieces a move will take", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		expect(testGame.getNumberOfCapturablePiecesFromLocation(34)).toBe(1);
	});
});

describe("When counting players pieces", function() {
	"use strict";
	
	it("should determine the number of pieces player 1 has", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		expect(testGame.getPlayerOnePoints()).toBe(2);
	});
	
	it("should determine the number of pieces player 1 has", function() {
		var testGame = new Game();
		testGame.startNewGame(false);
		
		expect(testGame.getPlayerOnePoints()).toBe(2);
	});
});
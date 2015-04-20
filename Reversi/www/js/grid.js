$(document).ready(function() { 
	
	"use strict";
    var isPlayingAgainstComputer = true;
    var scores;
    var isAtMainMenu = true;
	
	var game = new Game();
    game.start();
    
   document.getElementById("img").innerHTML = "<img src= 'images/blk.png' width='25' height='25'>";
    
	var GRID_NAMESPACE = GRID_NAMESPACE || {};

	GRID_NAMESPACE.handleClick = function () { //called every time a click on the screen is made.
		game.takeATurn($(this).attr("id"));
	};
    
    GRID_NAMESPACE.startNewGame = function() {
        game.startNewGame(isPlayingAgainstComputer); //todo: pass in whether or not playing against a computer.      
        
        var returnToGameButton = document.getElementsByName("returnToGameButton");
        returnToGameButton.item(0).disabled = false;
        
         
    };
    
    GRID_NAMESPACE.startProgramAtMainMenu = function() {
        var returnToGameButton = document.getElementsByName("returnToGameButton");
        returnToGameButton.item(0).disabled = true;  
    };
    
    GRID_NAMESPACE.singlePlayer = function(){
        isPlayingAgainstComputer = true;
        GRID_NAMESPACE.startNewGame();
    };
    
    GRID_NAMESPACE.multiPlayer = function(){
        isPlayingAgainstComputer = false;
        GRID_NAMESPACE.startNewGame();
    };
	
	GRID_NAMESPACE.resetBoard = function() {
		for (var i = 0; i <= 63; i++) {
			var id = "#" + i;
			
			var playerSymbol = " ";
			
			$(id).text(playerSymbol);
		}
	};
//    
//     GRID_NAMESPACE.viewScores = function() {
//        alert("got it");
//         $.getJSON("http://tholt4.pythonanywhere.com/_getScores", function(data){
//            var scoresStr = data.result;
//            scores = scoresStr.split(",");
//           
//        });
//        
//        GRID_NAMESPACE.showScores();
//    };
//    
//    GRID_NAMESPACE.showScores = function() {
//        var highscores = "<ul> Hey";
//        
//        for(var i = 0; i < scores.length; i++) {
//            highscores += <"li">+scores[i]+<"li">;    
//        }
//        highscores += "</ul>";
//
//      $("#scoreBoard").unbind ().bind ("pagebeforeshow", function ()
//
//      {
//
//        var $content = $("#scoreBoard div:jqmData(role=content)");
//
//        $content.html (highscores);
//
//        var $ul = $content.find ("ul");
//
//        $ul.listview ();
//
//      });
//
//        
//    };
    
    GRID_NAMESPACE.handlePlayerOnePointUpdate = function() {
        var values = [].slice.call(arguments, 1);
        var points = values[0];
        
        $("#playerOnePoints").text(points);
        
    };
    
    GRID_NAMESPACE.handlePlayerTwoPointUpdate = function() {
        var values = [].slice.call(arguments, 1);
        var points = values[0];
        
        $("#playerTwoPoints").text(points);
    };
    
    GRID_NAMESPACE.handleResetScoreFields = function() {
        $("#playerOnePoints").text("2");
        $("#playerTwoPoints").text("2");
    };
	
	GRID_NAMESPACE.handleCellClickedEvent = function () {
		var values = [].slice.call(arguments, 1);
		var id = "#" + values[0];//which box it is.
        
        $(id + ' img').last().remove();
		
		var playerSymbol = values[1];//the value to put in the box.
		if(playerSymbol == "X"){
            
            $(id).append("<img src= 'images/blk.png' width='25' height='25'>");
            document.getElementById("img").innerHTML = "<img src= 'images/blue.png' width='25' height='25'>";
        }else{
            $(id).append("<img src= 'images/blue.png' width='25' height='25'>");
            document.getElementById("img").innerHTML = "<img src= 'images/blk.png' width='25' height='25'>";
        }
	};


	GRID_NAMESPACE.addClickHandlers = function () {
		$("td").click(function() {
			GRID_NAMESPACE.handleClick.call(this);
		});
        
        $("#singlePlayerButton").click(function() {
            GRID_NAMESPACE.singlePlayer();
        });
        
        $("#multiPlayerButton").click(function() {
            GRID_NAMESPACE.multiPlayer();
        });
        
        $("#viewScoresButton").click(function() {
             alert("here");
            GRID_NAMESPACE.viewScores();
        });
        
        $(".toggleMainMenuAndGameButton").click(function() {
            GRID_NAMESPACE.switchBetweenMainMenuAndGame.call();
        });
	};
	
	GRID_NAMESPACE.data = {
			grid : [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29, 30, 31], [32, 33, 34, 35, 36, 37, 38, 39], 
                    [40, 41, 42, 43, 44, 45, 46, 47], [48, 49, 50, 51, 52, 53, 54, 55], [56, 57, 58, 59, 60, 61, 62, 63, 64]]
	};
	
	// IIFE to compile the template and build the grid 
	(function() {
		var source = $("#grid-template").html();
		var template = Handlebars.compile(source);
		
		$("#grid").html(template(GRID_NAMESPACE.data));
        
        GRID_NAMESPACE.startProgramAtMainMenu();
	}) ();
    
	$.subscribe('cellClickedEvent', GRID_NAMESPACE.handleCellClickedEvent);
	$.subscribe('resetBoardEvent', GRID_NAMESPACE.resetBoard);
    $.subscribe('playerOnePointUpdateEvent', GRID_NAMESPACE.handlePlayerOnePointUpdate)
    $.subscribe('playerTwoPointUpdateEvent', GRID_NAMESPACE.handlePlayerTwoPointUpdate)
    $.subscribe('resetScoreFieldsEvent', GRID_NAMESPACE.handleResetScoreFields)
	GRID_NAMESPACE.addClickHandlers();
    
	
    
    
	
	
});

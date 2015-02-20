function Driver2048(_solver,spd) {
  var size = 4;
  var speed = spd || 1;
  if(!size || size < 2)
    size = 2;
  
  var gameHandle = 0;
  this.setGameManager = function(gameM)
  {
    gameHandle = gameM;
  }

  var moveMap = ["UP   ","RIGHT","DOWN ","LEFT "];
  var verbose = false;
  var solver  = _solver;
  var totalMoves = 0;
  var interval = 0;
  var moveQ = [];
  //evaluation
  var startTime = 0;
  var endTime = 0;
  //debugging and play around
  this.board = gameHandle;
  
  function _getGrid(){
    var serial = gameHandle.grid.serialize().cells;
    //build grid
    var grid = [];
    for( i = 0; i < serial.length; ++i )
    {
      grid[i] = [];
      for( j = 0 ; j < serial[i].length ; ++j )
      {
        if( serial[i][j] )
          grid[i][j] = serial[i][j].value  
        else
          grid[i][j] = 0;
      }
    }
    return grid;
  }

  this.getGrid = function(){
    return _getGrid();
  }

  function _getScore(total){
    var grid = _getGrid();
    var max = grid[0][0];

    for( var i = 0 ; i < size ; ++ i )
      for( var j = 0 ; j < size ; ++ j ){
        if(total) {
          if( i || j )
            max += grid[i][j] 
        }
        else if ( max < grid[i][j] )
          max = grid[i][j];
      }
    
    return max;
  }
  this.getScore = function(){
    return _getScore();
  }

  function _solve(){
    var moves = solver.step(_getGrid());
    
    for( i in moves )
      moveQ.push(moves[i]);

    
    if( moveQ.length > 0 )
    {
      totalMoves ++;
      if( moveQ[0] >= 0 && moveQ[0] < 4)
      {
        gameHandle.move(moveQ[0]);
        if( verbose == 1 ) console.log(moveQ[0]+" "+moveMap[moveQ[0]]+" moves:"+totalMoves+" current maximum:"+_getScore());
      }
      else
        if( verbose == 1 ) console.log("Illegal move:"+moveQ[0]);
      
      moveQ.shift();
    }
    
    if( gameHandle.isGameTerminated() ){
      if( verbose == 2 )
      {
        endTime = new Date().getTime();
        console.log("Score,moves,time(seconds)");
        console.log(_getScore()+","+totalMoves+","+(endTime - startTime)/1000);
      }
      clearInterval(interval);
    }
  }

  this.solve = function( sol , spd ){
    
    if(!gameHandle)
      gameHandle = new GameManager(size, KeyboardInputManager, HTMLActuator, LocalStorageManager);

    if(sol)
      solver = sol;
    if(spd) 
      speed = spd;

    gameHandle.restart();
    moveQ = [];
    totalMoves = 0;
    
    if( totalMoves != 0 || interval )
      clearInterval(interval);
    
    if(solver && solver.step)
    { 
      if( verbose == 2 ){
        startTime = new Date().getTime();
        speed = 1;
      }

      _solve();
      interval = setInterval(_solve,speed);
    }
    else
      alert("Sorry you did not provide a proper solver object! Please check it and try again...");
  }

  this.setVerbose = function(_v){
    verbose = _v; 
  }
}

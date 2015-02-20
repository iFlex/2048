var verbose = false;
function Driver2048(_solver,spd) {
  var size = 4;
  var speed = spd || 1;
  if(!size || size < 2)
    size = 2;

  var gameHandle = new GameManager(size, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  var solver  = _solver;
  var totalMoves = 0;
  var interval = 0;
  var moveQ = [];
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

  this.getScore = function(){
    var grid = _getGrid();
    var max = grid[0][0];

    for( var i = 0 ; i < size ; ++ i )
      for( var j = 0 ; j < size ; ++ j )
        if( max < grid[i][j] )
          max = grid[i][j];
    
    return max;
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
        if(verbose) console.log("Moved:"+moveQ[0]+" total:"+totalMoves);
      }
      else
        if(verbose) console.log("Illegal move:"+moveQ[0]);
      
      moveQ.shift();
    }
    
    if( gameHandle.isGameTerminated() )
      clearInterval(interval);
  }

  this.solve = function( sol , spd ){
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
      _solve();
      interval = setInterval(_solve,speed);
    }
    else
      alert("Sorry you did not provide a proper solver object! Please check it and try again...");
  }
}

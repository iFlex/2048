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
  //statistics
  var grid = [];
  var score = 0;
  var sumScore = 0;
  var scores = [];
  var cellCount = 0;
  var moveCount = 0;
  var gridScans = 0;
  var maxScore = 0;
  var cellDistribution = {}

  function _prepStatsForUpdate(){
    cellDistribution = {}
    score = 0;
    sumScore = 0;
    cellCount = 0;
  }

  function _updateStats(value){
    cellCount++;
    sumScore += value;
    if(score < value){
      score = value;
    }
    if(maxScore < score){
      maxScore = score;
    }
    if(!cellDistribution[value]){
      cellDistribution[value] = 0;
    }
    cellDistribution[value] = cellDistribution[value] + 1;
  }

  function _getGrid(){
    if(gridScans == moveCount){
      gridScans++;
      var serial = gameHandle.grid.serialize().cells;
      //build grid
      grid = [];
      _prepStatsForUpdate();

      for( i = 0; i < serial.length; ++i ){
        grid[i] = [];
        for( j = 0 ; j < serial[i].length ; ++j ){
          if( serial[i][j] ){
            grid[i][j] = serial[i][j].value  
            _updateStats(grid[i][j]);
          } else {
            grid[i][j] = 0;
          }
        }
      }
    }
    return grid;
  }

  function _applyMove(move){
    moveCount++;
    gameHandle.move(move);
  }

  this.getGrid = function(){
    return _getGrid();
  }
  
  this.getScore = function(){
    return score;
  }
  this.getTrueScore = function(){
    return sumScore;
  }

  this.applyMove = function(move){
    _applyMove(move);
  }

  this.setVerbose = function(_v){
    verbose = _v; 
  }

  this.restart = function(){
    scores.push(this.getScore());
    
    moveCount = 0;
    gridScans = 0;
    _prepStatsForUpdate();
    
    gameHandle.restart();
  }

  this.isGameOver = function(){
    return gameHandle.isGameTerminated();
  }

  this.getStats = function(){
    return {
      games:scores.length,
      score:score,
      sumScore:sumScore,
      scores:scores,
      cellCount:cellCount,
      cellDistribution:cellDistribution,
      maxScore:maxScore
    }
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
        _applyMove(moveQ[0]);
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
      if(interval)  {
        clearInterval(interval);
      }
    }
  }
  
  this.step = function(){
    if(solver && solver.step)
      _solve();
    else
      alert("Sorry you did not provide a proper solver object! Please check it and try again...");
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

  this.noRendering = function(){
    gameHandle.setNoRendering(true);
  }
}

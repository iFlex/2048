function Solver()
{
  var size = 4;
  
  function getScore(g){
    var sum = 0;
    
    for( var i = 0 ; i < size ; ++ i )
      for( var j = 0 ; j < size ; ++ j )
        sum += g[i][j];
    
    return sum;
  }

  function moveAhead(g){
    
    return grid;
  }
  
  this.step = function(grid){
    console.log("UP");
    console.log(moveAhead(grid));
    
  }
}
var s = new Solver()
var driver = new Driver2048(s,1000);

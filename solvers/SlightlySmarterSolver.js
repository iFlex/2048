function Solver()
{
  var direction = {up:0,down:2,left:3,right:1};
  var confused = 0;
  var confusedMap = [0,1,3,2];
  var size = 4;
  function sumUp(grid){
    var sum = 0;
    var p = 0;
    for( i = 0 ; i < size; ++i ){
      for( p = 0; p<size; ++p )if(grid[i][p])break;//find first value
      for( j = p+1 ; j < size; ++j ){
        if( grid[i][p] == grid[i][j] && grid[i][j]){
          sum += grid[i][p] + grid[i][j];
          p=j+1;
          j++;
        }
        else
          p=j;
      }
    }
    return sum;
  }
  function sumSide(grid){
    var sum=0;
    var p=0;
    for( j = 0 ; j < size; ++j ){
      for( p = 0; p < size; ++p )if(grid[p][j])break;//find first value
      for( i = p+1 ; i < size; ++i ){
        if( grid[p][j] == grid[i][j] && grid[i][j]){
          sum += grid[i][j] + grid[p][j];
          p = i+1;
          i++;
        }
        else
          p=i;
      }
    }
    return sum;
  }

  function moveLeft(g){
    var grid = g.slice(0);
    var p=0;
    for( j = 0 ; j < size; ++j ){
      p = 0;
      for( i = p+1 ; i < size; ++i ){
        
        if( grid[p][j] == grid[i][j] || !grid[p][j]){
          grid[p][j] = grid[i][j] + grid[p][j];
          grid[i][j] = 0;
        }
        if( grid[p][j])
          p++;
      }
    }
    return grid;
  }

  function moveRight(g){
    var grid = g.slice(0);
    var p=0;
    for( j = 0 ; j < size; ++j ){
      p = size-1;
      for( i = p-1 ; i >= 0; --i ){
        
        if( grid[p][j] == grid[i][j] || !grid[p][j]){
          grid[p][j] = grid[i][j] + grid[p][j];
          grid[i][j] = 0;
        }
        if( grid[p][j])
          p--;
      }
    }
    return grid;
  }

  function gapOnTopRow(grid){
    ttable = [0,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0]
    code = 0;
    for( i = 0 ; i < size; ++i )
    { 
      code <<=1;
      if(grid[i][0])
        code |= 1;
    }
    return ttable[code];
  }
  //the algo
  var i = 0;
  this.step = function(grid){
    var moves = [];
    //attempt 1: - maximal sum obtained
    var sum = sumUp(grid);
    var sum2 = sumSide(grid);
    var got = gapOnTopRow(grid);
   
    if(sum >= sum2 && !got)
      moves.push(direction.up);
    else
      moves.push(direction.right);
    
    if( sum2 == sum && sum == 0 ) //shit need more pieces
    {
      console.log("confused:"+confused);
      moves.push(confusedMap[confused]);
      confused++;
      confused %=3;
    }
    else
      confused = 0;
    
    return moves;
  }
}

function DumbSolver()
{
  var i = 0;
  this.step = function(grid){
    var moves = [];
    i++;
    i%=4; 
    moves.push(i)
    return moves;
  }
}

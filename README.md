# 2048
Originally Made just for fun. [Play it here!](http://gabrielecirulli.github.io/2048/)

How to work with the automatic solver.
This modified version of 2048 allows you to run the game with various solving scripts.

How to run one: you need to have a script that solves the game in ./solvers folder
say the name of the solver is DumbSolver.js, to run it you simply need to open

index.html?team=DumbSolver

note the parameter team will specify what script to use to solve the game.
You can also set the speed at which the game will be solved

index.html?team=DumbSolver&speed=100 ( range [ 1 - your maximum magic patience number here ] )

How to build a solver? Here's the simplest example

function DumbSolver()
{
  var i = 0;
  
  this.step = function(grid){
    var moves = [];
    i++;
    i%=3; 
    moves.push(i)
    return moves;
  }
}

the step function will be called periodically from inside driver.js ( at the speed that you set )
You receive the status of the grid as a parameter, the cells are stored in the following fashion:
an array of arrays grid, where each array grid[i] is a clumn.
grid[0] is column 0, grid[1] is column 1
so grid[0][0] is the element on the first row and first column, grid[1][0] first row second column, etc

use this grid to decide your next move or multiple moves. 
return the moves in order in an array []. 
example:
var moves = [];
moves.push(0);
moves.push(1);
moves.push(2);
return moves;

the moves are mapped as follows:
0 = UP
1 = RIGHT
2 = DOWN
3 = LEFT

Good luck!

### Contributions

[Anna Harren](https://github.com/iirelu/) and [sigod](https://github.com/sigod) are maintainers for this repository.

Other notable contributors:

 - [TimPetricola](https://github.com/TimPetricola) added best score storage
 - [chrisprice](https://github.com/chrisprice) added custom code for swipe handling on mobile
 - [elektryk](https://github.com/elektryk) made swipes work on Windows Phone
 - [mgarciaisaia](https://github.com/mgarciaisaia) added support for Android 2.3

Many thanks to [rayhaanj](https://github.com/rayhaanj), [Mechazawa](https://github.com/Mechazawa), [grant](https://github.com/grant), [remram44](https://github.com/remram44) and [ghoullier](https://github.com/ghoullier) for the many other good contributions.

- [Milorad Liviu Felix](https://github.com/iFlex) added driver.js wrapper to allow solving the game with a script ( for the purpose of a competition for Glasgow University Tech Society

## License
2048 is licensed under the [MIT license.](https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt)


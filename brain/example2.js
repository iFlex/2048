// Source: http://cs.stanford.edu/people/karpathy/convnetjs/demo/rldemo.html

///////////////
// CONSTANTS //
///////////////

// Input and output definition:
// It's probably good to keep these in a separate file as constants:

var num_inputs = 4*4; // 4x4 grid with values
// We could also use it as 4x4x32 with a one-hot vector of dimension 32 instead of a linear value on the input
var num_actions = 4; // Slide up,right,down,left
var temporal_window = 0; // amount of temporal memory
var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs; // This means the network will get its last temporal_memory input and output values to work with as well
var driver = 0;
////////////////////
// INITIALIZATION //
////////////////////

// Network definition.
// It'd be nice if we could have this to be editable from the webpage to add/remove layers,
// change their sizes and activation functions, etc.
var layer_defs = [];
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
layer_defs.push({type:'regression', num_neurons:num_actions});

// Options for the Temporal Difference learner that trains the network
// by backproppagating the temporal difference learning rule.
// It would be nice to be able to change those as well.
var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};
// Other options, I don't understand yet those so no changing from the default values yet.
var opt = {};
opt.temporal_window = temporal_window;
opt.experience_size = 3000;
opt.start_learn_threshold = 1000;
opt.gamma = 0.7;
opt.learning_steps_total = 2000;//200000;
opt.learning_steps_burnin = 300;//3000;
opt.epsilon_min = 0.05;
opt.epsilon_test_time = 0.05;
opt.layer_defs = layer_defs;
opt.tdtrainer_options = tdtrainer_options;

function normaliseValue(val){
    if( val == 0 ) {
        return 0;
    }
    return Math.log2(val)/32.0;
}

function serialiseGrid(grid){
    var result = [];
    for(var i = 0; i < grid.length; ++i){
        for( var j = 0 ; j < grid[i].length; ++j){
            result.push(normaliseValue(grid[i][j]));
        }
    }
    return result;
}

function normaliseValueForCounting(val){
    if( val == 0 ) {
        return 0;
    }
    return Math.log2(val);
}

var brain = 0;
var highscore = 2048;
var canRun = true;
var iterations = 0;
var statsAfter = {};
var statsBefore = {};

function calculateReward(){
    console.log("STATS")
    console.log(statsBefore);
    console.log(statsAfter);
    return 1.0;
}

function brainTrain(delay){
    // Highscore should probably be read from somewhere else, so we can set its goal somewhere
    if(!brain)
        brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
    
    function trainStep(){
        if( iterations > brain.learning_steps_total ) {
            alert( "Stopped being random" );
        }
        
        if(driver.isGameOver()){
            brain.backward(-32.0); // Penalize for game over
            driver.restart();
        }

        statsBefore = driver.getStats();
        var input = serialiseGrid( driver.getGrid());
        var action = brain.forward( input );
        console.log("ACTION:"+action);
        driver.applyMove( action );
        statsAfter = driver.getStats();
        
        brain.backward(calculateReward());
        iterations++;
        
        if( statsAfter.score <= highscore && canRun) {
            setTimeout(trainStep,2000);        
        }
    }
    trainStep();    
}


function brainSetDriver(eldriver){
    driver = eldriver;
}

function brainStop(){
    canRun = false;
    // Save network
    var saved_net = JSON.stringify( brain.value_net.toJSON() );
    var filename = "brain"
    var blob = new Blob([saved_net], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename+".json");
    // Load network
    //brain.value_net.fromJSON( JSON.parse( saved_net ) );
    // Stop learning after loading the network
    //brain.epsilon_test_time = 0.0; // Stop making random choices
    //brain.learning = false; // And stop learning
}

function sumArray(a) {
    sum = 0;
    for(var i = 0; i<a.length; i++){
        sum += a[i];
    }
    return sum;
}

function meanArray(a) {
    return sumArray( a ) / a.length;
}

function lastArray( a, _last ) {
    var last = _last || 10;
    l = [];
    for(var i = a.length - 1; i>=0 && l.length < last; i--){
        l.push( a[i] );
    }
    return l;
}
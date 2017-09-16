// Source: http://cs.stanford.edu/people/karpathy/convnetjs/demo/rldemo.html

///////////////
// CONSTANTS //
///////////////

// Input and output definition:
// It's probably good to keep these in a separate file as constants:

var num_inputs = 4*4; // 4x4 grid with values
// We could also use it as 4x4x32 with a one-hot vector of dimension 32 instead of a linear value on the input
var num_actions = 4; // Slide up,right,down,left
var temporal_window = 1; // amount of temporal memory
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
opt.experience_size = 30000;
opt.start_learn_threshold = 1000;
opt.gamma = 0.7;
opt.learning_steps_total = 200000;
opt.learning_steps_burnin = 3000;
opt.epsilon_min = 0.05;
opt.epsilon_test_time = 0.05;
opt.layer_defs = layer_defs;
opt.tdtrainer_options = tdtrainer_options;

var brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo

function normaliseValue(val){
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

async function brainTrain(delay){
    // Highscore should probably be read from somewhere else, so we can set its goal somewhere
    var highscore = 2048;
    var score = 0;
    while( score <= highscore ) {
        if(driver.isGameOver()){
            driver.restart();
        }

        var input = preprocess_grid( driver.getGrid());
        var action = brain.forward( input );
        // action is a number in [0, num_actions) telling index of the action the agent chooses
        // here, apply the action on environment and observe some reward. Finally, communicate it:
        driver.applyMove( action );
        var reward = 0.0;
        var crntScore = driver.getScore();
        // Reward it for making more points
        // We can improve this after we have the pilot working
        if( score > crntScore ) {
            reward = 1.0;
        }
        score = crntScore;
        brain.backward(reward);
        await sleep(delay);
    }

}

function sleep(ms){
    new Promise(resolve => setTimeout(resolve, ms));
}

function brainSetDriver(eldriver){
    driver = eldriver;
}

function brainStop(){
    // I still have to look up this function. But it should store export the network as a JSON file, which we can display in a textbox for the user to save
    save_network_as_json();
    // Save network
    saved_net = JSON.stringify( brain.value_net.toJSON() );
    // Load network
    brain.value_net.fromJSON( JSON.parse( saved_net ) );
    // Stop learning after loading the network
    brain.epsilon_test_time = 0.0; // Stop making random choices
    brain.learning = false; // And stop learning
}

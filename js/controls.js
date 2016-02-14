var synth = T("OscGen", {wave:"saw", mul:0.25}).play();


// var midicps = T("midicps");

var map = []


var BASE = 60;

for (var i = 0; i < 256; i++) {
	map[i] = {pressed: false, held_length: 0};
}

//Start midi stuff
var m = null; // m = MIDIAccess object for you to make calls on
var data;
if(navigator.requestMIDIAccess !== undefined){

    navigator.requestMIDIAccess().then(

        function onFulfilled(access){
            midi = access;
            
            var inputs = midi.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
               // each time there is a midi message call the onMIDIMessage function
                  input.value.onmidimessage = onMIDIMessage;
            }
        },

        function onRejected(e){

        }
    );
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    //console.log('MIDI data', data); // MIDI data [144, 63, 73]
    console.log("Key Number", data[1]);
    var key = data[1];
    var strength = data[2];
    if(strength > 0){
        map[key].held_length += strength * .25;
        map[key].pressed = true;

        var freq = getFrequency(key);
        console.log(freq);
        var release_time = Math.min(400 + map[key].held_length * 40, 3000);
        // console.log(release_time);
        var tempsynth = T("sin", {freq:freq, mul:0.25});
        var env = T("perc", {r:release_time}, tempsynth).bang().play();
        spawnNote(world, release_time, key);
    }
    else{ //strength == 0

        // reset variables
        map[key].pressed = false;
        map[key].held_length = 0;
    }
}
//End midi stuff


document.onkeydown = function(event) {
    event = event || window.event;
    var e = event.keyCode;
    // only play once let go
	// held down
	map[e].held_length++;
	map[e].pressed = true;
	
    // space bar = clear
    if (e == 32) {

    }
	//console.log(map[e].held_length);
    
}
document.onkeyup = function(event) {
    event = event || window.event;
    var e = event.keyCode;
    var midi = midiDict(e, BASE);
    //didn't press a good key
    //console.log(midi);
    if (!midi) return;

    //console.log(midi);
    var freq = getFrequency(midi);
    console.log(freq);
    var release_time = Math.min(400 + map[e].held_length * 40, 3000);
    var tempsynth = T("sin", {freq:freq, mul:0.25});
    var env = T("perc", {r:release_time}, tempsynth).bang().play();
    // synth.def.env = env;

	// synth.noteOnWithFreq(freq, 100, env);

	spawnNote(world, release_time, keyDict(midi));

	// console.log(world.getBodies());

	// reset variables
    map[e].pressed = false;
    map[e].held_length = 0;
}


function collision_sound(pos) {
    // console.log(pos.y);

    var height_ratio = pos.y / height;
    var width_ratio = pos.x / width;
    var offset = 200; // lowest freq

    var freq = width_ratio * (400) + offset;

    //console.log(freq);

    // var release_time = Math.min(400 + map[e].held_length * 40, 3000);
    // console.log(release_time);
    var tempsynth = T("sin", {freq:freq, mul:0.05});
    var env = T("perc", {r:400}, tempsynth).bang().play();
}

function getFrequency(midi_code) {


    var offset_code = midi_code - 69;
    if (offset_code > 0) {
        return Number(440 * Math.pow(2, offset_code / 12));
    } 
    else {
        return Number(440 / Math.pow(2, -offset_code / 12));
	}
}

function midiDict(keycode, offset) {
    var midi = offset; //offset == base == 60
    //console.log(keycode);
    if(keycode < 48 || keycode > 57) return null; //0 is 48, 9 is 57
    
    return keycode; //gives freq 220, c3 on keyboard
}

function keyDict(midi) {
    var midi_temp = midi - BASE;
    var left_bound = 100;
    // 10 is number of keys I'm using
    var tempwidth = (width-200)/17;

  
    return left_bound + midi_temp * tempwidth;
}

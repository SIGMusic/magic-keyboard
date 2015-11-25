function spawnNote(note, size, x) {
	var offset = $("#canvasid").offset();

	//320 is middle width
    var px = x - offset.left;
    var py = height - 50 - offset.top;

    var side_len = size/30;

    var rand_x = (Math.random()*2 - 1)/100;

    var hue = px/width; 
    // console.log(hue)
    var body = Physics.body("circle",{
            x: px,
            y: py,

            styles: {
                strokeStyle: '#123456',
                lineWidth: 0,
                fillStyle: 'hsl(' + hue*360 + ', 100%, 50%)',
                // angleIndicator: 'white'
            },
            radius: side_len,
            restitution:0.5,
    });
    world.add(body.applyForce(Physics.vector(rand_x,-0.1)));

}

// // Matter.js module aliases
// var Engine = Matter.Engine,
//     World = Matter.World,
//     Bodies = Matter.Bodies;

// // create a Matter.js engine
// var engine = Engine.create(document.body);

// var bodies = []

// // create two boxes and a ground

// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// // add all of the bodies to the world
// World.add(engine.world, ground);

// // run the engine
// Engine.run(engine);

var world;
var width = window.innerWidth;
var height = window.innerHeight-100;
 
var possible_coords = []
// console.log(possible_y);

$(document).ready(function(){
    // world declaration
    world = Physics();
    // creation of the renderer which will draw the world
    var renderer = Physics.renderer("canvas",{
            el: "canvasid", // canvas element id
        width: width,     // canvas width
        height: height,        // canvas height
        // meta: "false"     // setting it to "true" will display FPS
        styles: {
            'circle' : {
               strokeStyle: '#542437',
               lineWidth: 0,
               fillStyle: '#542437',
               // angleIndicator: 'white'
           }
       }
    }); 
    // adding the renderer to the world
    world.add(renderer);
    // what happens at every iteration step? We render (show the world)
    world.on("step",function(){
            world.render();
    });
    // this is the default gravity
    var gravity = Physics.behavior("constant-acceleration",{
            acc: {
            x:0, 
            y:0.0004
        } 
    });
    // adding gravity to the world
    world.add(gravity);
    // adding collision detection with canvas edges
    // world.add(Physics.behavior("edge-collision-detection", {
    //     aabb: Physics.aabb(0, 0, width, 10),
    //     restitution: 0
    // }));
    
    //world has a floor
    // world.add(Physics.body('convex-polygon',{
    //         x: width/2,
    //         y: 0,
    //         treatment: 'static',
    //         vertices: [
    //             {x:0, y:0},
    //             {x:0, y:10},
    //             {x:width, y:10},
    //             {x:width, y:0}

    //         ]
    // }));

    // bodies will react to forces such as gravity
    world.add(Physics.behavior("body-impulse-response"));
    // enabling collision detection among bodies
    world.add(Physics.behavior("body-collision-detection"));
    world.add(Physics.behavior("sweep-prune"));
    //  $("#canvasid").click(function(e){
    //     // checking canvas coordinates for the mouse click
    //     var offset = $(this).offset();
    //     var px = e.pageX - offset.left;
    //     var py = e.pageY - offset.top;
    //     // this is the way physicsjs handles 2d vectors, similar at Box2D's b2Vec
    //     var mousePos = Physics.vector();
    //     mousePos.set(px,py);
    //     // finding a body under mouse position
    //     var body = world.findOne({
    //         $at: mousePos
    //     })
    //     // there isn't any body under mouse position, going to create a new box
    //     if(!body){
    //         world.add(Physics.body("convex-polygon",{
    //                 x: px,
    //                 y: py,
    //                 vertices: [
    //                     {x:0, y:0},
    //                     {x:0, y:60},
    //                     {x:60, y:60},
    //                     {x:60, y:0}

    //                 ],
    //                 restitution:0.5,
    //         }).applyForce(Physics.vector(0,-0.05)));


    //     }
    //     else{
    //         // there is a body under mouse position, let's remove it
    //         world.removeBody(body);
    //     } 
    // })
    // handling timestep
    Physics.util.ticker.on(function(time,dt){
            world.step(time);
            removeOffScreen()
    });
    Physics.util.ticker.start();


    var img = document.createElement('img');
    img.src = "img/keys.png";
    img.height = "100";
    document.body.appendChild(img);
})


function removeOffScreen() {
    // var bodies = world.findOne({
    //         $nin: possible_y
    // });
    var bodies = world.getBodies();
    for (var body of bodies) {
        // body.recalc();
        // console.log(body.state.pos._[1]);
        if (body.state.pos._[1] > height){
            world.remove(body);
        }
    }
    
}
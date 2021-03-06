

var config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 2000,
    parent: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 750 },
            debug: false
        }
    },
    scene: {
        key: "main",
        preload: preload,
        create: create,
        update: update
        // add scale manager for full scene deployment
    }
};



var game = new Phaser.Game(config);


function preload() {
    this.load.tilemapTiledJSON('map', '/assets/map/map.json', '/assets/map/map.tmx');
    this.load.image('TILESET', '/assets/map/CleanedTileSet.png', '/assets/map/CleanedTileSet.json');
    this.load.image('sky', '/assets/background3.png');
    this.load.image('ground', '/assets/platform.png');
    this.load.image('bolt1', '/assets/Bolt.png');
    this.load.image('bolt2', '/assets/Bolt.png');
    this.load.spritesheet('king', '/assets//character/king.png', { frameWidth: 20, frameHeight: 23 });
    this.load.image('cloud1', '/assets/cloud8.png');
    this.load.image('cloud2', '/assets/cloud7.png');
    this.load.image('cloud3', '/assets/cloud6.png');
    this.load.image('cloud4', '/assets/cloud5.png');
    this.load.image('lightning', '/assets/lightning.png'); 
    this.load.audio("theme", "/assets/theme.mp3");
    this.load.tilemapTiledJSON("foreground", '/assets/map/map.json', '/assets/map/map.tmx');
    this.load.tilemapTiledJSON("background", '/assets/map/map.json', '/assets/map/map.tmx');
    this.load.image('skymid', '/assets/background2.png');
    this.load.image('skyfore', '/assets/background1.png');
    this.load.image('skyback', '/assets/background3.png');

    // this.load.objects("objects", '/assets/map/map.json', '/assets/map/map.tmx');

}


var player;
var bolt;
var bolt1;
var bolt2;
var platforms;
var cursors;
var movingPlatform;
var map;
var ground;
var tileSet;
var moveCam = true;


// keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//  keySPACE.enabled = false;

function create() {
  
    // King -Player Sprite and spawn location x, y
    



    this.cameras.main.zoom = 4;
    this.cameras.main.roundPixels = true;

    let mbg = this.add.image(0, 0, 'skymid');
    let bbg = this.add.image(0, 0, 'skyback');
    let fbg = this.add.image(0, 0, 'skyfore');
    // Align.scaleToGameW(bg, 2);
   
    
    var map = this.make.tilemap({key: 'map'});
    

    const tileSet = map.addTilesetImage('CleanedTileSet', 'TILESET', 16, 16, 0, 0 );
    // const tileset = map.addTilesetImage("tileset", "tileset-extruded", 48, 48, 1, 2);
    // const backgroundLayer = map.createStaticLayer('Background', tileset, 0, 0);
    // const interactiveLayer = map.createLayer('Interactive', tileset, 0, 0);

    // createFromObjects(layerName, {
    //     name: "sign"
    // })

    // Place Pictures in order to have them display correctly
    var backgrounds = map.createLayer('background', tileSet, 0, 0);  
    
    
    player = this.physics.add.sprite(570, 2750, 'king');

    var midgrounds = map.createLayer('Tile Layer 1', tileSet, 0, 0);
    midgrounds.setCollisionByProperty({ Collision: true })


    var foregrounds = map.createLayer('foreground', tileSet, 0, 0);
 


    
    // this.player.setDepth(2)
    // midgrounds.setDepth(2)
    // foregrounds.setDepth(1)
    // backgrounds.setDepth(3)
// this.physics.world.bounds.width = groundLayer.width;
// this.physics.world.bounds.height = groundLayer.height;

    this.add.image(600, 250, 'cloud1');
    this.add.image(700, 150, 'cloud2');
    this.add.image(750, 400, 'cloud3');
    this.add.image(300, 450, 'cloud4');

    // platforms = this.physics.add.staticGroup();
    // clouds = this.physics.add.staticGroup();

    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    


    // movingPlatform = this.physics.add.image(400, 400, 'ground');
    // movingPlatform.setImmovable(true);
    // movingPlatform.body.allowGravity = false;
    // movingPlatform.setVelocityX(50);

    // clouds.create(500, 668, 'cloud1').setScale(2).refreshBody();
    
    // movingClouds = this.physics.add.image(500, 250, 'cloud1');
    // movingClouds.setImmovable(true);
    // movingClouds.body.allowGravity = false;
    // movingClouds.setVelocityX(50);
    


    
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true;
    this.cameras.main.startFollow(player)
  
    this.physics.add.collider(player, midgrounds);
    this.physics.add.staticGroup()
  

    this.anims.create({
 
        key: 'left',
        frames: this.anims.generateFrameNumbers('king', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
        
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'king', frame: 5 }],
        frameRate: 10
    });
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'king', start: 6, end: 10 }],
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('king', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    bolt1 = this.physics.add.group({
        key: 'bolt1',
        repeat: 1,
        setXY: { x: 500, y: 0, stepX: 70 }
    });

    bolt2 = this.physics.add.group({
        key: 'bolt2',
        repeat: 1,
        setXY: { x: 700, y: 0, stepX: 70 }
    });

    bolt1.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));

    });

    bolt2.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));

    });

    // this.physics.add.collider(bolt1, midgrounds);
    
    this.physics.add.collider(bolt1, midgrounds);
    this.physics.add.collider(bolt1, player, collectBolt1);

    this.physics.add.collider(bolt2, midgrounds);
    this.physics.add.collider(bolt2, player, collectBolt2);
    // this.physics.add.collider(bolt, movingPlatform);

//     this.physics.add.overlap(player, bolt, collectBolt, null, this);
//     theme = this.sound.add("theme");
//     theme.play({
//     volume: 0.2,
//     loop: true
//   });




// boltCollect(game)
// function boltCollect(game) {
 
    //     var bolt= game.data.immovable = game.add.sprite(game.world.centerX - 32, game.world.centerY - 32, 'blocks', 0);
    //     imm.width = 64;
    //     imm.height = 64;

    //     // enable physics and set immovable
        // game.physics.enable(imm);
        // imm.body.immovable = true;
        // 
    //      bolt.disableBody(true, true)





    // };
}

// objectsLayer.objects.foreach(objData => {
//     const { x = 0, y = 0, name } = objData

//     switch (name)
//     {
//         case "kingSpawn":
//         {
//             console.log(yeppers)
//              break;
//         }
//     }
// })
// }





function update() {
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
        player.flipX = true;
        player.body.setVelocityX(-120);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
        player.flipX = false;
        player.body.setVelocityX(120);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // if(cursors.right.isDown){
    //     console.log(player.body.velocity.y)
    // }



    if (cursors.up.isDown && player.body.velocity.y > -1.388888888888889 && player.body.velocity.y < 1.388888888888889) {
        // console.log(player.body.velocity.y)
        // player.setVelocityY(0)
        player.setVelocityY(-330);
        player.anims.play('jump', true);
        // player.flipY = true;
    }

    // if (movingPlatform.x >= 500) {
    //     movingPlatform.setVelocityX(-50);
    // }
    // else if (movingPlatform.x <= 300) {
    //     movingPlatform.setVelocityX(50);
    // }


    this.physics.add.collider(player, bolt1);
    
    // (player, bolt) => {
    //     console.log(player, bolt)
    // }

    // var console = function(){console.log(bolt)}


    


    collectBolt = function(player,bolt1){
        console.log("bolt");
        bolt.disableBody(true, true);
    }
    
}

// function cloudMovement(){
//     if (movingCloud.x >= 500) {
//         movingCloud.setVelocityX(-50);
//     }
//     else if (movingCloud.x <= 300) {
//         movingCloud.setVelocityX(50);
//     }
// }

//action of picking up bolt, session or db relationship
function collectBolt1(player, bolt1) {
    console.log("comment");
    bolt1.disableBody(true, true);
}

function collectBolt2(player, bolt2) {
    console.log("comment2");
    bolt2.disableBody(true, true);
}

    // This is the route that gets our comments
    // corresponds to in game event trigger
    // if(){
    //     const response = await fetch(`/${:id}`, {
    //         method: "GET"
    //     })
    // }





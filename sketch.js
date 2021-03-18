
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
var mario, mariohead, marioimgL, marioimgR, marioaniL, marioaniR;
var tetris, t1img, t2img, t3img, t4img, t5img, t6img, t7img;
var ground, sideL, sideR;
var jumpsound,bgmusic
var gamestate = "intro"
var jumpcount = 0;
var lava;
var plat1, plat2, plat3
var play,hardness


function preload() {
	marioaniL = loadAnimation("images/lll.png", "images/ls.png", "images/lrl.png");
	marioaniR = loadAnimation("images/rs.png", "images/rrl.png");
	marioimgR = loadImage("images/rs.png");
	marioimgL = loadImage("images/ls.png")
	t1img = loadImage("images/t-1.png")
	t2img = loadImage("images/t-2.png")
	t3img = loadImage("images/t-3.png")
	t4img = loadImage("images/t-4.png")
	t5img = loadImage("images/t-5.png")
	t6img = loadImage("images/t-6.png")
	t7img = loadImage("images/t-7.png")
	jumpsound = loadSound("sounds/mjs.mp3")
	bgmusic = loadSound("sounds/bg.mp3")



}

function setup() {
	//make the canvas
	createCanvas(400, 600);


	//setup mario
	mario = createSprite(200, 500, 10, 20);
	mariohead = createSprite(200, 481, 20, 5)
	mario.addImage("mariorest", marioimgL);
	mario.scale = 0.08;
	mario.addAnimation("walkL", marioaniL);
	mario.addAnimation("walkR", marioaniR);
	mariohead.visible = false

	//make the groups
	mariogroup = new Group()
	tgroup = new Group()
	ggroup = new Group()
	platgroup = new Group()

	//make ground and walls
	ground = createSprite(200, 620, 600, 40);
	ggroup.add(ground)
	sideL = createSprite(-20, 300, 40, 600);
	ggroup.add(sideL)
	sideR = createSprite(420, 300, 40, 600);
	ggroup.add(sideR)
	// make the lava
	lava = createSprite(200, 900, 400, 600)
	// make the platforms
	plat1 = createSprite(20, 570, 70, 20)
	platgroup.add(plat1)
	plat2 = createSprite(200, 570, 70, 20)
	platgroup.add(plat2)
	plat3 = createSprite(380, 570, 70, 20)
	platgroup.add(plat3)
	hardness = createSprite(100,500,30,30)
	hardness.visible = false
	play = createSprite(370,500,30,30)
	play.visible = false





}

function draw() {
	if(keyDown("M")){
		//background music :)
		bgmusic.play()
	}
	//background setting
	if (gamestate == "intro") {
		
		mario.visible = false
		plat1.visible = false
		plat2.visible = false
		plat3.visible = false
		lava.visible = false
		background("white")
		fill("black")
		textSize(70)
		text("welcome", 100, 300)
		
		if (frameCount > 50) {
			fill("black")
			textSize(50)
			text("to mario", 150, 340)
		}
		if (frameCount > 100) {
			fill("black")
			textSize(50)
			text("with a twist", 120, 380)
			fill("black")
			textSize(20)
			text("-----jump is space bar------>play", 110, 420)
			fill("black")
			textSize(20)
			text("left = a   (M for music)   right = d", 100, 200)
			mario.visible = true
	
		
			if (keyDown("A")) {
				mario.x = mario.x - 4;
				mario.changeAnimation("walkL", marioaniL);
			}
			else {
				mario.changeImage("mariorest", marioimgL);
			}

			//move right with D key
			if (keyDown("D")) {
				mario.x = mario.x + 4;
				mario.changeAnimation("walkR", marioaniR);
			}
			else {
				mario.changeImage("mariorest", marioimgR);
			}
			
			
			if(mario.isTouching(hardness)){
 
			}
			if(mario.isTouching(play)){
				
				gamestate = "start"
			}
		}
		



	}

	if (gamestate == "start") { 

		background("aqua")
		fill("white")
		textSize(20)
		text("Press S to Start", 140, 300)
		fill("white")
		textSize(20)
		text("dont get smashed by a block or fell in lava", 15, 200)
		mario.x = 200


	}
	if (keyDown("S")) {
		gamestate = "play"
	}

	if (gamestate == "play") {
		background("cyan")
		plat1.visible = true
		plat2.visible = true
		plat3.visible = true
		lava.visible = true
		//start the lava
		if (frameCount % 5 === 0) {
			lava.y = lava.y - 1
		}
		//start the platforms
		if (frameCount % 5 === 0) {
			plat1.y = plat1.y - 1
			plat2.y = plat2.y - 1
			plat3.y = plat3.y - 1
		}


		//double jump count 
		fill("white")
		text("Power:" + jumpcount, mario.x - 15, mario.y - 30)
		//gravity to mario
		mario.velocityY = mario.velocityY + 2

		//not fall throught the ground
		mario.collide(ground)

		//make the soft spot of mario follow his body
		mariohead.y = mario.y - 20
		mariohead.x = mario.x

		//move left with A key
		if (keyDown("A")) {
			mario.x = mario.x - 4;
			mario.changeAnimation("walkL", marioaniL);
		}
		else {
			mario.changeImage("mariorest", marioimgL);
		}

		//move right with D key
		if (keyDown("D")) {
			mario.x = mario.x + 4;
			mario.changeAnimation("walkR", marioaniR);
		}
		else {
			mario.changeImage("mariorest", marioimgR);
		}




		//add mario to his group
		mariogroup.add(mario);

		//make mario not fly too high
		if (mario.velocityY < -25) {
			mario.velocityY = -25
		}


		//collide teris block with other things
		tgroup.collide(tgroup)
		mario.collide(tgroup)
		mario.collide(ggroup)
		mario.collide(platgroup)
		// mario win
		if(plat1.y <50){

			gamestate = "win"
			
		}
		// mario death
		if (mario.isTouching(lava)) {
			gamestate = "end"
		}

		//functions
		tetris()
		doublejump()
	}
	if(gamestate == "win"){
		plat1.visible = false
		plat2.visible = false
		plat3.visible = false
		lava.visible = false
		fill("white")
		textSize(20)
		text("You won? how? ok well play again!", 10, 300)
		
	}
	if (gamestate == "end") {
		background("black")

		mario.visible = false
		plat1.visible = false
		plat2.visible = false
		plat3.visible = false
		lava.visible = false
		fill("white")
		textSize(20)
		text("You probably died (you did just fall in lava)", 10, 300)
	}

	drawSprites();










	//make the tetris blocks function
	function tetris() {
		if (frameCount % 80 === 0) {
			var tetris = createSprite(200, 1, 50, 50);
			tetris.x = mario.x
			tetris.scale = 0.3
			tetris.velocityY = tetris.velocityY + 2





			var rand = Math.round(random(1, 7));
			switch (rand) {
				case 1: tetris.addImage(t1img);
					break;
				case 2: tetris.addImage(t2img);
					break;
				case 3: tetris.addImage(t3img);
					break;
				case 4: tetris.addImage(t4img);
					break;
				case 5: tetris.addImage(t5img);
					break;
				case 6: tetris.addImage(t6img);
					break;
				case 7: tetris.addImage(t7img);
					break;
				default: break;
			}
			tgroup.add(tetris)
			tgroup.collide(tgroup)
			tgroup.lifetime = 100



		}
	}
}
// make the double jump function
function doublejump() {
	if (frameCount % 70 === 0) {
		jumpcount = jumpcount + 1
	}
	if (keyDown("SPACE") && jumpcount > 0) {
		mario.velocityY = mario.velocityY - 25;
		jumpsound.play()
		jumpcount = jumpcount - 1
	}
}



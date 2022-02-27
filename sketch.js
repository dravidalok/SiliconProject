var night,nightImg;

var zombie, zombieImg, zombieGroup;
var bullet, bulletGroup;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png.png","trex3.png.png","trex4.png.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  nightImg = loadImage("night.jpg")

  zombieImg = loadImage("zombie.png")

  bulletImg = loadImage("bullet.png.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //adding the background image
  night = createSprite(displayWidth/2-20,displayHeight/2-40,100,100)
night.addImage(nightImg)
night.scale = 2.5
night.velocityX = -(6 + 3*score/100);
  
  trex = createSprite(40,height-60,10,40);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  
  
  gameOver = createSprite(width/2,height/2-80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-60,400,10);
  invisibleGround.visible = false;
  
  
  obstaclesGroup = new Group();
  
  
  score = 0;
 //creating group
  zombieGroup = new Group()
  bulletGroup = new Group()

 

}

function draw() {
  //trex.debug = true;
  background(0);
  button = createButton("score"+score)
  button.position(700,50)
  fill("red")
  text("Score: "+ score, 700,50);

  if (night.x < 215){
  night.x = night.width/2 ;
  }

 

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    
  
    if(keyDown("space") && trex.y >= height-150) {
      trex.velocityY = -12;
    }
   
     //release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("m")||touches.length>0){
 
  
  bullet = createSprite(trex.x + 42, trex.y - 25, 20,5)
  bullet.velocityX = 5 
  bulletGroup.add(bullet)
  bullet.addImage(bulletImg)
  bullet.scale = 0.03
  
}


    enemy()
  
    trex.velocityY = trex.velocityY + 0.8
  
  
    trex.collide(invisibleGround);
    
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

    if(zombieGroup.isTouching(trex)){
      gameState = END;
  }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    night.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    zombieGroup.setVelocityXEach(0);
    
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
   
    
    if(mousePressedOver(restart)) {
      reset();

    }
    
  }
  
   //killing zombie
   if(zombieGroup.isTouching(bulletGroup)){
    for(i = 0;i < zombieGroup.length;i ++){
      if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        score = score + 1
        
      }
    }
  }

   
  
 
  
  drawSprites();
  
}

function enemy(){
  if( frameCount%75 ===0 ){
    zombie = createSprite(width,height-200, 10, 10)
    zombieGroup.add(zombie)
    zombie.addImage(zombieImg)  
    zombie.velocityX = - 5
    zombie.scale = 0.1

  }
}

  


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-60,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(8 + 3*score/100);
    
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  zombieGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  night.velocityX = -(6 + 3*score/100);
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
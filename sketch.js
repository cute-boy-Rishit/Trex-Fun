var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud,cloud_image;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var ObstaclesGroup, CloudsGroup;
var count = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverimg
var restart,restartimg
var count = 0;
  

function preload(){
  trex_running  = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  cloudimage   = loadImage ("cloud.png");
  obstacle1     = loadImage ("obstacle1.png");
  obstacle2     = loadImage ("obstacle2.png");
  obstacle3     = loadImage ("obstacle3.png");
  obstacle4     = loadImage ("obstacle4.png");
  obstacle5     = loadImage ("obstacle5.png");
  obstacle6     = loadImage ("obstacle6.png");
  gameOverimg      = loadImage ("gameOver.png");
  restartimg      = loadImage ("restart.png");
                         
  
  groundImage = loadImage("ground2.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5; 
  
 gameOver = createSprite(300,100);
 restart  = createSprite(300,130);
 
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.5;
  restart.addImage(restartimg);
  restart.scale = 0.5;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
   ObstaclesGroup = createGroup();
   CloudsGroup = createGroup();
  
}

function draw() {
  background(300);    
  //display score
  text("Score: "+ count,500,50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -6;
    //scoring
   count = count + Math.round(World.frameRate/62);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
     
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -14;
      //playSound("jump.mp3",false);
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
        gameState = END;
        //playSound("die.mp3");
        trex.velocityY = -12;
        trex.changeAnimation("collided",trex_collided);
    }
    
    if (count % 100 === 0 && count>0){
      //playSound("checkPoint.mp3");
   }
    
    if (count == 50 === 0 && count>0){
      ground.velocityX = +3;
   } 
   }    
  else if(gameState === END) {
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    trex.pause();
   
    //set lifetime of the game objects so that they are  never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
  }
  
    //restarting the game
  if (mousePressedOver(restart)){
      gameState = PLAY;
      gameOver.visible = false;
      restart.visible = false;
      ObstaclesGroup.destroyEach();
      CloudsGroup.destroyEach();
      trex.changeAnimation("running",trex_running);
      count = 0; 
      trex.play();
   }
  
  trex.collide(invisibleGround);
  drawSprites();
  }

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,160,10,40);
    obstacle.velocityX = -(6 + count/200);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
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
    default:break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
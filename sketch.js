/**********************CÓDIGO AJUSTADO POR DÉBORA VERAS PEREIRA*************************/ 


//VARIÁVEIS GAMESTATE
var PLAY = 1;
var END = 0;
var START = 2;
var gameState = START;

//VARIÁVEIS TREX, GROUND E INVISIBLE GROUND
var trex, trex_running, trex_collided, trex_stop;
var ground, invisibleGround, groundImage;

//VARIÁVEIS OBSTACULOS E NUVENS
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//VARIÁVEL SCORE
var score=0;
//VARIÁVEIS PARA IMAGENS START, RESTART, GAMEOVER 
var start, startIMG, gameOver, restart;

//VARIÁVEIS PARA SONS
var jumpSound, dieSound, checkPointSound;

function preload(){
  //PRÉ-CARREGAMENTO ANIMAÇÃO E IMAGEM TREX
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_stop = loadImage ("trex1.png");
  
  //PRÉ-CARREGAMENTO IMAGEM GROUND
  groundImage = loadImage("ground2.png");
  
  //PRÉ-CARREGAMENTO IMAGEM NUVEM
  cloudImage = loadImage("cloud.png");

  //PRÉ-CARREGAMENTO IMAGENS OBSTÁCULOS
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //PRÉ-CARREGAMENTO IMAGEM GAMEOVER, RESTART, START e BACKGROUND
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  startIMG = loadImage ("start.png");
  

  //PRÉ-CARREGAMENTO SONS
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {

  //CRIAÇÃO DE CANVAS COM AJUSTE AUTOMÁTICO Á TELA
  createCanvas(windowWidth, windowHeight);

  //CRIAÇÃO DE SPRITE TREX, ATRIBUIÇÃO DE ANIMAÇÃO E IMAGEM
  trex = createSprite(50,height-70,20,50);
  trex.addImage("stop",trex_stop);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  //DIMENSIONAMENTO TREX
  trex.scale =0.7;
  
  //CRIAÇÃO DE SPRITE GROUND, ATRIBUIÇÃO DE IMAGEM, POSIÇÃO X E VELOCIDADE
  ground = createSprite(width-50,height-30,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);

  //CRIAÇÃO DE SPRITE INVISIBLEGROUND E DANDO INVISIBILIDADE A ELE
  invisibleGround = createSprite(width/2,height-10, width,10);
  invisibleGround.visible = false;

  //CRIAÇÃO DE SPRITE GAMEOVER, ATRIBUIÇÃO DE IMAGEM E DIMENSIONAMENTO
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  //CRIAÇÃO DE SPRITE RESTART, ATRIBUIÇÃO DE IMAGEM E DIMENSIONAMENTO
  restart = createSprite(width/2,height/2+30);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  //CRIAÇÃO DE SPRITE START, ATRIBUIÇÃO DE IMAGEM E DIMENSIONAMENTO
  start = createSprite (width/2, height/2-70);
  start.addImage (startIMG);
  start.scale =0.2;

  //TORNANDO GAMEOVER, RESTART E START INVISÍVÉIS DURANTE ESTADO PLAY
  gameOver.visible = false;
  restart.visible = false;
  start.visible = false;

  //CRIAÇÃO DE GRUPO CLUODS E OBSTACLES
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  //INICIALIAZAÇÃO DE SCORE COM 0
  score = 0;
}

function draw() {
  
  //trex.debug = true;
  background("white");

  //EXIBIR SCORE NA TELA COM AJUSTE AUTOMÁTICO
  textSize(15);//TAMANHO DA FONTE
  text("Pontuação: "+ score, width-250, height/6);
  
  //AÇÕES PARA ESTADO DO JOGO START
  if (gameState === START){
    
    //EXIBIR ICONE START
    start.visible = true;
    //PARAR SOLO E TREX
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.y = height-50;//POSIÇÃO VERTICAL TREX

    //PARAR MOVIMENTO GRUPO OBSTACULOS E NUVENS
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //SE HOUVER TOQUE NA TELA OU BOTÃO START FOR CLICADO
    //INICIAR ESTADO PLAY E INJETAR 1 ELEMENTO A TOUCHES
    if (touches.length>0){
      gameState = PLAY;
      touches.push({x:0,y:0,id:0});
    }
    if (mousePressedOver(start) ){
      gameState = PLAY;
    } 
      
    
  }

  //AÇÕES PARA ESTADO DE JOGO PLAY
  if (gameState === PLAY){

    //GERAR PONTUAÇÃO DE ACORDO COM QTDE DE QUADROS POR SEGUNDO
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);//VELOCIDADE DO SOLO AUMENTA PROPORCIONAL A SCORE
    trex.changeAnimation("running",trex_running);//MUDAR ANIMAÇÃO DO TREX
    
    //TORNAR ICONE START INVISIVEL
    start.visible = false;
    
    /**********************************************************************************************************
     * Para verificar se houve toque na tela, usamos a matriz touches, predefinida na biblioteca P5. Se o 
     * comprimento de touches for maior que 0, isso indica que houve toque, portanto trex ganha velocidade 
     * vertical, o som do pulo é executado, zeramos a matriz touches e injetamos um elemento nela.
     * Quando não injetamos um elemento, o trex só pula após 3º clique.
     **********************************************************************************************************/

    //CONDICIONAL PARA VERIFICAR SE HOUVE TOQUE NA TELA
    if(touches.length > 0 &&  trex.y >= height-120) {
      trex.velocityY = -12;//TREX PULA
      jumpSound.play();//SOM DO PULO É EXECUTADO
      touches = [];//MATRIZ TOUCHES É ZERADA
      touches.push({x:0,y:0,id:0});//INJETAMOS UM ELEMENTO A TOUCHES
    }
    //CONDICIONAL PARA VERIFICAR SE BARRA DE ESPAÇO FOI PRESSIONADA
    if (keyDown("space") && trex.y >= height-120){
      trex.velocityY = -12;//TREX PULA
      jumpSound.play();//SOM DE PULO É EXECUTADO
    }

    //GRAVIDADE DO TREX
    trex.velocityY = trex.velocityY + 0.9
    
    //CONDICIONAL PARA RECONFIGURAR SOLO
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //TREX COLIDE COM GROUND INVISÍVEL
    trex.collide(invisibleGround);

    //FUNÇÕES PARA GERAR NUVENS E OBSTÁCULOS
    spawnClouds();
    spawnObstacles();
    
    //CONDICIONAL PARA VERIFICAR SE OBSTACULOS ESTÁ TOCANDO TREX
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;//MUDAR PARA ESTADO END
        dieSound.play();//TOCAR SOM DE MORTE
    }

  } else if (gameState === END) {//ESTADO DE JOGO END
      //EXIBIR ICONE GAMEOVER E RESTART
      gameOver.visible = true;
      restart.visible = true;
      
      //DEFINIR VERLOCIDADE 0 PARA OBJETOS
      ground.velocityX = 0;
      trex.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      
      //MUDAR ANIMAÇÃO DO TREX
      trex.changeAnimation("collided",trex_collided);
      
      //DEFININDO TEMPO DE VIDA DOS OBJETOS PARA QUE NÃO SEJAM DESTRUÍDOS
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      //SE TOUCHES FOR MAIOR QUE 0 OU MOUSE PRESSIONAR RESTART, RESETAR JOGO E ZERAR TOUCHES
      if(touches.length>0 || mousePressedOver(restart)) {
        touches = [];
        reset();
      }
    }
  //EXIBIR SPRITES 
  drawSprites();
}

//FUNÇÃO PERSONALIZADO PARA GERAR NUVENS
function spawnClouds() {
  //CRIAR SPRITE NUVEM A CADA 60 QUADROS
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height/2-100,40,10);//POS X E Y AJUSTADA A TELA
    cloud.y = Math.round(random(80,120)); //POS X E Y ALEATÓRIAS
    cloud.addImage(cloudImage);//DEFINIR IMAGEM DA NUVEM
    cloud.scale = 0.6;//DEFINIR DIMENSÃO DA NUVEM
    cloud.velocityX = -3;//ATRIBUIR VELOCIDADE
    cloud.lifetime = 350;//TEMPO DE VIDA DA NUVEM *EVITAR VAZAMENTO DE MEMÓRIA*
    
    //AJUSTE DE PROFUNDIDADE TREX EM RELAÇÃO A NUVEM
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //ADICIONAR NUVEM A GRUPO CLOUD
    cloudsGroup.add(cloud);
  }
  
}

//FUNÇÃO PERSONALIZADO PARA GERAR OBSTÁCULOS
function spawnObstacles() {
  //GERAR OBSTÁCULOS A CADA 60 QUADROS
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width/2,height-40,10,40);//POS X E Y AJUSTADA A TELA
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);//VELOCIDADE DO OBSTACULO PRPORCIONAL A SCORE
    
    //GERAR OBSTÁCULO ALEATÓRIO
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

    //ESCALA E TEMPO DE VIDA DE OBSTÁCULOS        
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    //ADICIONAR OBSTÁCULOS AO GRUPO
    obstaclesGroup.add(obstacle);
  }
}

//FUNÇÃO PARA REINICIAR JOGO
function reset(){

  //ALTERAR PARA ESTADO START
  gameState = START;

  //TORNAR ICONES GAMEOVER E RESTART INVISÍVEIS
  gameOver.visible = false;
  restart.visible = false;

  //DESTRUIR GRUPO DE OBSTÁCULOS E NUVENS
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  //ALTERAR IMAGEM TREX
  trex.changeImage("stop",trex_stop);

  //ZERAR SCORE
  score = 0;
  
}

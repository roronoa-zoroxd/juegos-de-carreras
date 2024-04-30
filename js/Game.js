class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadderporttitle = createElement("h2");
    this.leadder1 = createElement("h2");
    this.leadder2 = createElement("h2");

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    // C38 TA
    fuels = new Group();
    powerCoins = new Group();

    // Agregando sprite de combustible al juego
    this.addSprites(fuels, 4, fuelImage, 0.02);

    // Agregando sprite de monedas al juego
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
  }

  // C38 TA
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
   

    //C39
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);
    this.leadderporttitle.html("tabla de puntuación");
    this.leadderporttitle.class("resetText");
    this.leadderporttitle.position(width/3 -60,40)

    this.leadder1.class("leadderText");
    this.leadder1.position(width/3 -50,80);
    this.leadder2.class("leadderText");
    this.leadder2.position(width/3 -50,130);
    

  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getcarsAtEend();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showleadderboard();
      this.ShowLife();
      this.showfuelbar();

      //índice de la matriz
      var index = 0;
      for (var plr in allPlayers) {
        //agrega 1 al índice por cada bucle
        index = index + 1;

        //utiliza datos de la base de datos para mostrar los autos en la dirección x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        // C38  SA
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          
          // Cambiando la posición de la cámara en la dirección y
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;

        }
      }

      // manejando evetnso keyboard
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
      this.handlePlayerControls();
      const finishline = height*6 -100;
      if (player.positionY > finishline){
        gameState = 2;
        player.rank += 1;
        Player.updatecarsAtEend(player.rank);
        player.update();
        this.showRank();


      }

      drawSprites();
    }
  }

  handleFuel(index) {
    // Agregando combustible
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //recolectado está el sprite en el grupo de recolectables que activarón
      //el evento
      collected.remove();
    });
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {

      player.score += 21;
      player.update();
      //recolectado está el sprite en el grupo de recolectables que activarón
      //el evento
      collected.remove();
    });
  
}

handleResetButton() {
  this.resetButton.mousePressed(() => {
   //establece el valor inicial para los jugadores y gamecount.
   database.ref("/").set({
    playerCount: 0,
    gameState: 0,
    players: {}
   }) 
   window.location.reload();
  });
}
ShowLife(){ 
  push(); 
  image(lifeImage,width/2-130,height-player.positionY-185,20,20);
   fill("white"); 
   rect(width/2-100,height-player.positionY-185,185,20);
    fill("red"); 
    rect(width/2-100,height-player.positionY-185,player.life,20); 
    pop();

}
 showfuelbar(){
  push();
  image(fuelImage,width/2 - 130, height - player.positionY - 100,20,20)
  fill("white");
  rect(width/2 -100, height - player.positionY -100,185,20)
  fill("orange");
  rect(width/2 -100, height -player.positionY -100, player.fuel,20);
  pop();
 }
showleadderboard(){
  var leadder1,leadder2;
  var players = Object.values(allPlayers);
  if ((players[0].rank === 0 && players[1].rank === 0)|| players[0].rank === 1){
    leadder1 = 
    players[0].rank + 
    "&emsp;" + 
    players [0].name +
    "&emsp;" +
    players[0].score;
  
  leadder2 = 
    players[1].rank + 
    "&emsp;" + 
    players [1].name +
    "&emsp;" +
    players[1].score;
}
if (players[1].rank === 1){
  leadder1 = 
    players[1].rank + 
    "&emsp;" + 
    players [1].name +
    "&emsp;" +
    players[1].score;
  
  leadder2 = 
    players[0].rank + 
    "&emsp;" + 
    players [0].name +
    "&emsp;" +
    players[0].score;
}
this.leadder1.html(leadder1);
this.leadder2.html(leadder2);
}
handlePlayerControls() {
  if (keyIsDown(UP_ARROW)) {
    player.positionY += 10;
    player.update();
  }

 //ingresa la tecla para izquierda y derecha
 if (keyIsDown(LEFT_ARROW)&& player.positionX >width/3 -50) {
  player.positionX -= 10;
  player.update();
}
if (keyIsDown(RIGHT_ARROW)&& player.positionX <width/2 +300) {
  player.positionX += 10;
  player.update();
}
}
showRank(){
  swal({
    title:`¡Impresionante!${"\n"}Rank${"\n"}${player.rank}`,
    text:"crusaste la linea de meta con éxito",
    imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize:"100x100",
    confirmButtonText:"ok"

  })
}
}

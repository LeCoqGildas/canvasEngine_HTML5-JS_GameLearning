//On associe le canvas à canvasEngine
var canvas = CE.defines("canvas")
		.extend(Tiled)
		.extend(Spritesheet)
		.extend(Animation)
		.extend(Input)
		.extend(Scrolling)
		.ready(function() {
	//appel de la scene Preload
	canvas.Scene.call("Preload");

});






/*Préchargement
/************************************************************************/
canvas.Scene.new({
	name: "Preload",
	materials: {
		images: {
				background_preload: "img/sd/preload/background.png",
				bar_empty: "img/sd/preload/empty.png",
				bar_full: "img/sd/preload/full.png"
				
		}
	},
	ready: function(stage) {
		var self = this,
		el = this.createElement();
		el.drawImage("background_preload", 0, 0);
		stage.append(el);
		
		//charge les fichiers référencées dans le fichier .json
		CE.getJSON("data/materials.json", function(files) {
			var percentage = 0,
				bar_full = self.createElement(),
				bar_empty = self.createElement();

			bar_empty.drawImage("bar_empty" , 215, 250);

			stage.append(bar_empty);
			stage.append(bar_full);
			//à chaque fois qu'un fichier est chargé on dessine davantage la barre full
			canvas.Materials.load("images", files , function(){
				percentage += Math.round(100 / files.length);
				bar_full.drawImage("bar_full", 215, 250, percentage + "%");
				stage.refresh();
			}, function(){
				//console.log("fini");
				canvas.Scene.call("Title");
			});
		}, 'json');

			

	},
	render: function(stage){
		stage.refresh();
	}
});

/*Ecran titre
/*******************************************************************************/
canvas.Scene.new({
	name: "Title",
	ready: function(stage){
		var self = this,
			buttons = {
				play : {
					height: 73,
					click: function() {
						//canvas.Scene.call("spritesheet");
						//canvas.Scene.call("map1");
						canvas.Scene.call("joueurColision");
						
					}
				},
				option : {
					height: 73,
					click: function() {
						canvas.Scene.call("joueur");
					}
				}
			};

		var fond = self.createElement();
		fond.drawImage("_background", 0, 0);
		stage.append(fond);


		var pos = 0;
		for(var key in buttons){
			displayButton(buttons[key], pos);
			pos += buttons[key].height ;
		}

		function displayButton(data_btn, pos){
			var width = 200,
				btn = self.createElement(200,73);

				btn.drawImage("button_Off", 0, pos, width, data_btn.height, 0, 0, width, data_btn.height);
				btn.x = 325;
				btn.y = pos + 180;
				
				btn.on("click", data_btn.click);
				btn.on("mouseover",function() {
					this.drawImage("button_On", 0, pos, width, data_btn.height, 0, 0, width, data_btn.height);
				});
				btn.on("mouseout",function() {
					this.drawImage("button_Off", 0, pos, width, data_btn.height, 0, 0, width, data_btn.height);
				});
				
				stage.append(btn);


		}
		

	},
	render: function(stage){
		
		stage.refresh();
	}
});



/*Import d'une carte réalisée avec Tiled Map Editor
/********************************************************************************/
canvas.Scene.new({
	name: "map1",
	materials: {
		images: {
				//même nom que dans tiled map editor
				tile:"img/sd/tilesets/tile.png",
				fond:"img/sd/tilesets/fond.png",
				plateforme:"img/sd/tilesets/plateforme.png",
				spritesheet: "img/sd/spritesheet/spritesheet.png",
				player:"img/sd/player/player.png"
		}
	},
	ready: function(stage) {
		var fond = this.createElement();
		fond.drawImage("fond", 0, 0);
		stage.append(fond);

		var tiled = canvas.Tiled.new();
		tiled.load(this, stage, "data/level4.json");
		tiled.ready(function (){
			var tile_w = this.getTileWidth();
				tile_h = this.getTileHeight();
		});
		
		var animation = canvas.Animation.new({
			images: "coin2",
			animations: {
				standard:{
					frames: [0,7],
					size:{
						width : 32,
						height: 32
					},
					frequence : 3
				}
			}
		});
		var petitePiece = this.createElement();
		petitePiece.x=420;
		petitePiece.y=405;
		animation.add(petitePiece);
		animation.play("standard", "loop");
		stage.append(petitePiece);

		//Piece qui bouge
		var piece = this.createElement(256,256);
		piece.drawImage("coin");

		piece.x = 320;
		piece.y = 0;

		var timeline_over = canvas.Timeline.new(piece)
		.to({scaleX:1.2, scaleY:1.2}, 40, Ease.easeOutElastic);

		var timeline_out = canvas.Timeline.new(piece)
		.to({scaleX:1, scaleY:1}, 40, Ease.easeOutElastic);

		piece.on("mouseover", function() {
				timeline_over.call();
		});
		piece.on("mouseout", function() {
				timeline_out.call();
		});

		stage.append(piece);


		var spritesheet = canvas.Spritesheet.new("spritesheet", { 
			grid: [{
				size: [5,3], //5 lignes, 3 collones
				tile: [150,40], //width/height d'un element
				set: ["test1", "test2", "test3","test4","test5"]
			}]
		});
		var btn = this.createElement(150,40);
		btn.x = 5;
		btn.y = 5;
		spritesheet.draw(btn,"test1");
		stage.append(btn);


		//plateforme
		this.entity = Class.new("Game_Entity", [350,380]);
		this.elPlateform = this.createElement();
		this.elPlateform.drawImage("plateforme");
		this.elPlateform.x =  this.entity.x;
		this.elPlateform.y =  this.entity.y;
		stage.append(this.elPlateform);

		//Player
		this.player = Class.new("Game_Player", [100, 395]);

		this.elPlayer = this.createElement();
		this.elPlayer.drawImage("player");
		this.elPlayer.x = this.player.x;
		this.elPlayer.y = this.player.y;

		stage.append(this.elPlayer);

		/*canvas.Input.keyDown(Input.Bottom);
		canvas.Input.keyDown(Input.Up);*/
		var self = this;
		canvas.Input.keyUp(Input.Right, function(){
			self.player.moveClear();
			self.player.setDeceleration("right");
			//animation...
		});
		canvas.Input.keyUp(Input.Left, function(){
			self.player.moveClear();
			self.player.setDeceleration("left");
			//animation...
		});
		canvas.Input.press(Input.Up, function(){
			self.player.jump(true);
			//animation...
		});
		canvas.Input.keyUp(Input.Up, function(){
			self.player.jump(false);
			//animation...
		});

		

	},
	render: function(stage){
		this.elPlateform.x = this.entity.moveLoop(350,600);

		this.elPlayer.x = this.player.decelerationUpdate();
		
		
		var input={
			//"bottom":[Input.Bottom, "y"],
			"up":[Input.Up, "y"],
			"left":[Input.Left, "x"],
			"right":[Input.Right, "x"]
		};
		if(canvas.Input.isPressed(Input.Up)){
			this.player.jumpUpdate();
		}
		for(var key in input){
			if(canvas.Input.isPressed(input[key][0])){
				this.elPlayer[input[key][1]] = this.player.move(key);
			}
		};
		
		
		this.player.y = this.player.gravityUpdate();
		stage.refresh();
	}
	
});

canvas.Scene.new({
	name: "joueur",
	materials: {
		images: {
				player:"img/sd/player/player.png"
		}
	},
	ready: function(stage) {
		//Player
		this.player = Class.new("Game_Player", [50, 50]);
		this.player.map_height = 480;
		this.player.height = 56;
		this.elPlayer = this.createElement();
		this.elPlayer.drawImage("player");
		this.elPlayer.x = this.player.x;
		this.elPlayer.y = this.player.y;
		
		stage.append(this.elPlayer);
		

		/*canvas.Input.keyDown(Input.Bottom);
		canvas.Input.keyDown(Input.Up);*/
		//on utilise une autre variable car sinon on perd le this
		var self = this;
		canvas.Input.keyUp(Input.Right, function(){
			self.player.moveClear();
			self.player.setDeceleration("right");
			//animation...
		});
		canvas.Input.keyUp(Input.Left, function(){
			self.player.moveClear();
			self.player.setDeceleration("left");
			//animation...
		});
		
		canvas.Input.press(Input.Up, function(){
			
			self.player.jump(true);
			//console.log("saut");
			//animation...
		});
		canvas.Input.keyUp(Input.Up, function(){
			
			self.player.jump(false);
			//console.log("lacher saut");
			//animation...
		});


	},
	render: function(stage){
		
		
		var input={
			//"bottom":[Input.Bottom, "y"],
			//"up":[Input.Up, "y"],
			"left":[Input.Left, "x"],
			"right":[Input.Right, "x"]
		};
		
		for(var key in input){
			if(canvas.Input.isPressed(input[key][0])){
				this.player[input[key][1]] = this.player.move(key);
			}
		};
		if(canvas.Input.isPressed(Input.Up)){
			this.player.jumpUpdate();
		}
		
		this.elPlayer.x = this.player.decelerationUpdate();
		this.elPlayer.y = this.player.gravityUpdate();
		stage.refresh();
	}
	
});


canvas.Scene.new({
	name: "scrolling",
	materials: {
		images: {
			background:"img/sd/tilesets/fond.png"
		}
	},
	ready: function(stage) {
		var W_TILE = 32;
		var H_TILE = 32;
		var background = this.createElement();
		background.drawImage("background");
		stage.append(background);

		this.scrolling = canvas.Scrolling.new(this, W_TILE, H_TILE);
		//heros
		var player = this.createElement();
		this.scrolling.setMainElement(player);

		this.scrolling.addScroll({
			element: background, //element décor
			speed: 1,//vitesse de defilement
			block: true, //ne défile plus si les extremite touche le bord du canvas
			width: 120,
			parallax: true,
			height: 50
		});

		//decor
		var map = this.createElement();
		var scrool_map = this.scrolling.addScroll({
			element: map, //element décor
			speed: 3,//vitesse de defilement
			block: true, //ne défile plus si les extremite touche le bord du canvas
			width: 120,
			height: 50
		});
		
	},
	render: function(stage){
		this.scrolling.update();
		
		stage.refresh();
	}
	
});


canvas.Scene.new({
	name: "joueurColision",
	materials: {
		images: {
				player:"img/sd/player/player.png",
				tile:"img/sd/tilesets/tile.png",
				fond:"img/sd/tilesets/fond.png"
		}
	},
	ready: function(stage) {
		var self = this;

		var tiled = canvas.Tiled.new();

		tiled.load(this, stage, "data/level4.json");

		tiled.ready(function() {

			
			self.game_map = Class.new("Game_Map", [this]);

			var tile_w = this.getTileWidth();
			var tile_h = this.getTileHeight();

			
			self.player = self.createElement(50,56);
			//self.game_player = Class.new("Game_Player", [8 * tile_w, 12 *  tile_h, self.game_map]);
			self.game_player = Class.new("Game_Player", [50, 50, self.game_map]);
			//self.game_player.height = 56;

			
			self.player.drawImage("player");
			self.player.x = self.game_player.x;
			self.player.y = self.game_player.y;
			
			stage.append(self.player);
		});
			canvas.Input.keyUp(Input.Right, function(){
				self.game_player.moveClear();
				self.game_player.setDeceleration("right");
				//animation...
			});
			canvas.Input.keyUp(Input.Left, function(){
				self.game_player.moveClear();
				self.game_player.setDeceleration("left");
				//animation...
			});
			
			canvas.Input.press(Input.Up, function(){
				
				self.game_player.jump(true);
				//console.log("saut");
				//animation...
			});
			canvas.Input.keyUp(Input.Up, function(){
				
				self.game_player.jump(false);
				//console.log("lacher saut");
				//animation...
			});
		
		
			
	},
	render: function(stage){
		if(!this.game_player){
			return;
		}
		var input={
			"left":[Input.Left, "x"],
			"right":[Input.Right, "x"]
		};
		
		for(var key in input){
			if(canvas.Input.isPressed(input[key][0])){
				this.game_player[input[key][1]] = this.game_player.move(key);
			}
		}
		
		if(canvas.Input.isPressed(Input.Up)){
			this.game_player.jumpUpdate();
		}
		
		this.player.x = this.game_player.decelerationUpdate();
		this.player.y = this.game_player.gravityUpdate();


		stage.refresh();
	}
	
	
});
/* auteur:LE COQ Gildas */

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

			bar_empty.drawImage("bar_empty" , 350, 364);

			stage.append(bar_empty);
			stage.append(bar_full);
			//à chaque fois qu'un fichier est chargé on dessine davantage la barre full
			canvas.Materials.load("images", files , function(){
				percentage += Math.round(100 / files.length);
				bar_full.drawImage("bar_full", 350, 364, percentage + "%");
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
						canvas.Scene.call("map");
						
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
				btn.x = 400;
				btn.y = pos + 250;
				
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


canvas.Scene.new({
	name: "map",
	materials: {
		images: {
				//player:"img/sd/player/playerfix.png",
				playerFg:"img/sd/player/playerfixg.png",
				playerFd:"img/sd/player/playerfixd.png",
				playerL:"img/sd/player/playergauche.png",
				playerD:"img/sd/player/playerdroite.png",
				meca:"img/sd/tilesets/plateform/meca.png",
				coin3:"img/sd/piece/coin3.png"
		}
	},
	sprites: {},
	//coins: {}, //avec une touche, rajouter ce qui est en bas
	addCoin: function(id, layer, data){
		var coins = this.game_map.addEntity(id,data);
		var sprite = this.sprites[id] = Class.new("Sprite_Coins", [id, this, layer, data]);
		coins.callHit(function(){
			sprite.hit(true);//appel l'annimation touché ref=Sprite_Coins
		}, function(){
			sprite.hit(false);//appel l'annimation non touché
		});
		//avec une touche, enlever tout ce qui est au dessus
		//this.coins[id] = this.game_map.addEntity(id,data);
		//this.sprites[id] = Class.new("Sprite_Coins", [id, this, layer, data]);
	},
	pressCoins: function(){
		var self = this;
		canvas.Input.press(Input.Enter, function(){
			for(var id in self.coins){
				if(self.coins[id].isHit()){
					self.sprites[id].hit(true);
				}
			}
		});
	},
	ready: function(stage) {	
		var self = this;
		var tiled = canvas.Tiled.new();

		/*var fond = self.createElement();
			fond.drawImage("fond");
			stage.append(fond);*/
			
		tiled.load(this, stage, "data/meca.json");

		tiled.ready(function() {
			var tile_w = this.getTileWidth();
			var tile_h = this.getTileHeight();
			var layer_event;

			self.game_map = Class.new("Game_Map", [this]);
			self.game_player = Class.new("Game_Player", ["monPlayer",128,256,6 * tile_w, 15*tile_h, self.game_map]);

			self.player = self.createElement();
			self.player.drawImage("playerFd");
			self.player.x = self.game_player.x;
			self.player.y = self.game_player.y;


			layer_event = this.getLayerObject();
			self.addCoin(1, layer_event, {
				x: 9 * tile_w,
				y: 15 * tile_h,
				width: 128,
				height: 128
			});

			stage.append(self.player);//affiche le joueur
			

			self.scrolling = canvas.Scrolling.new(self, tile_w, tile_h);
			self.scrolling.setMainElement(self.player);
			
			var map = self.scrolling.addScroll({
				element: this.el, //element décor
				speed: 50,//vitesse de defilement
				block: true, //ne défile plus si les extremite touche le bord du canvas
				width: this.getWidthPixel(),
				height: this.getHeightPixel()
			});
			self.scrolling.setScreen(map);

			/*var fondscreen = self.scrolling.addScroll({
				element: fond, //element décor
				speed: 1,//vitesse de defilement
				block: true, //ne défile plus si les extremite touche le bord du canvas
				width: this.getWidthPixel(),
				parallax: false,
				height: this.getHeightPixel()
			});
			self.scrolling.setScreen(fondscreen);*/
		







			var anim_right = canvas.Animation.new({
				images:"playerD",
				animations:{
					right:{
						frames: [0,6],
						size:{
							width:128,
							height:256,
						},
						frequence: 5
					}
				}
			});
			var anim_left = canvas.Animation.new({
				images:"playerL",
				animations:{
					left:{
						frames: [0,6],
						size:{
							width: 128,
							height: 256,
						},
						frequence: 5
					}
				}
			});

			anim_left.add(self.player);
			anim_right.add(self.player);

			canvas.Input.keyDown(Input.Right, function(){
				self.player
				anim_right.play("right",true);
			});

			canvas.Input.keyDown(Input.Left, function(){
				anim_left.play("left",true);
				
			});

			canvas.Input.keyUp(Input.Right, function(){
				anim_right.stop();
				self.game_player.moveClear();
				self.game_player.setDeceleration("right");
				self.player.drawImage("playerFd");
				
			});

			canvas.Input.keyUp(Input.Left, function(){
				anim_left.stop();
				self.game_player.moveClear();
				self.game_player.setDeceleration("left");
				self.player.drawImage("playerFg");
			});
				
			canvas.Input.press(Input.Space, function(){	
				self.game_player.jump(true);
				//console.log("saut");
				//animation...
			});

			canvas.Input.keyUp(Input.Space, function(){	
				self.game_player.jump(false);
				//console.log("lacher saut");
				//animation...
			});

			//piece avec une touche
			//self.pressCoins();

		});
	
	},
	render: function(stage){
		if(!this.game_player){
			return;
		}
		
		var input={
			"left":Input.Left,
			"right":Input.Right,
			"space":Input.Space
		};
		for(var key in input){
			if(canvas.Input.isPressed(input[key])){
				this.player["x"] = this.game_player.move(key);
			}
		}
		if(canvas.Input.isPressed(Input.Space)){
			this.game_player.jumpUpdate();	
		}

		this.scrolling.update();
		this.player.x = this.game_player.decelerationUpdate();
		this.player.y = this.game_player.gravityUpdate();
		
		stage.refresh();

	}
	
	
});


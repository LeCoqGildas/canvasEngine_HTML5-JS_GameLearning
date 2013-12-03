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


canvas.Scene.new({
	name: "map",
	materials: {
		images: {
				player:"img/sd/player/spritesheet-marioFix.png",
				playerL:"img/sd/player/mariogauche.png",
				playerD:"img/sd/player/mariodroite.png",
				tile:"img/sd/tilesets/tile.png",
				fond:"img/sd/tilesets/fond.png"
		}
	},
	ready: function(stage) {	
		var self = this;
		var tiled = canvas.Tiled.new();
		var fond = self.createElement();
			fond.drawImage("fond");
			stage.append(fond);
			
		tiled.load(self, stage, "data/level5.json");

		tiled.ready(function() {
			
			self.game_map = Class.new("Game_Map", [this]);
			var tile_w = this.getTileWidth();
			var tile_h = this.getTileHeight();
			
			self.player = self.createElement();
			self.game_player = Class.new("Game_Player", ["monPlayer",32,32,1 * tile_w, 8*tile_h, self.game_map]);
			self.player.drawImage("player");
			self.player.x = self.game_player.x;
			self.player.y = self.game_player.y;
			stage.append(self.player);

			self.scrolling = canvas.Scrolling.new(self, tile_w, tile_h);
			self.scrolling.setMainElement(self.player);
			
			var map = self.scrolling.addScroll({
				element: this.el, //element décor
				speed: 3,//vitesse de defilement
				block: true, //ne défile plus si les extremite touche le bord du canvas
				width: this.getWidthPixel(),
				height: this.getHeightPixel()
			});
			self.scrolling.setScreen(map);

			var fondscreen = self.scrolling.addScroll({
				element: fond, //element décor
				speed: 2,//vitesse de defilement
				block: true, //ne défile plus si les extremite touche le bord du canvas
				width: 1200,
				parallax: false,
				height: 480
			});
			self.scrolling.setScreen(fondscreen);
		
			var anim_right = canvas.Animation.new({
				images:"playerD",
				animations:{
					right:{
						frames: [0,3],
						size:{
							width:32,
							height:32,
						},
						frequence: 6
					}
				}
			});
			var anim_left = canvas.Animation.new({
				images:"playerL",
				animations:{
					left:{
						frames: [0,3],
						size:{
							width: 32,
							height: 32,
						},
						frequence: 6
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
				self.player.drawImage("player");
				
			});

			canvas.Input.keyUp(Input.Left, function(){
				anim_left.stop();
				self.game_player.moveClear();
				self.game_player.setDeceleration("left");
				self.player.drawImage("player");
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

Class.create("Game_Player", {
	map: null,
	currentState: "",
	speed: 15,
	x: 0,
	y: 0,
	a: 0,//acceleration
	d: 1,//decélération
	height : 32,
	width : 32,
	dece_dir: false,
	dir: "right",
	_gravity:{
		power: 50,
		velocity: 0
	},
	_jump:{
		power: 40,
		velocity: 1
	},
	initialize: function(id, width, height, x, y, map){
		this.x = x;
		this.y = y;
		this.id = id;
		this.width = width;
		this.height = height;
		this.map = map;
	},
	move: function(dir){
		this.dir = dir,
		this.a += .05;
		if(this.a >= 1){
			this.a =1;
		}
		var speed = this.speed * this.a;
		var x = this.x;

		switch(dir){
			case "left":
				x -= this.speed;
				break;
			case "right":
				x += this.speed;
				break;
		}
		if(this.map.isPassable(this, x, this.y)){
			//console.log("passable");
			this.x = x;

		}else{
			//console.log("pas passable");
		}
		return this.x;

	},
	moveClear: function(){
		this.a = 0;
		this.d = 1;
	},
	decelerationUpdate: function(){
		var dir = this.dece_dir;

		if (dir){
			this.d -= .1;
			if(this.d <= 0){
				this.d = 0;
				this.dece_dir = false;
			}
			var speed = this.speed * this.d;
			var x = this.x;
			switch(dir){
	
				case "left":
					x -= speed;
					break;
				case "right":
					x += speed;
					break;
			}
			if(this.map.isPassable(this, x, this.y)){
				//console.log("passable");
				this.x = x;
			}else{
				//console.log("pas passable");
			}
		}
		return this.x;
	},
	setDeceleration: function(dir){
		this.dece_dir = dir;
	},
	gravityUpdate: function(){
		var velocity = this._gravity.velocity; 
		var new_y = this.y;
		if(this.currentState != "jumping"){
			velocity += .05;
			if(velocity >= 1){
				velocity = 1;
			}
			new_y += (this._gravity.power * velocity);
			if(this.map.isPassable(this, this.x, new_y)){
				this.y = new_y;
				this._gravity.velocity = velocity;		
			}
			else{
				this.currentState = "platform";
				this._gravity.velocity = 0;
				//console.log("platform");
			}
		}	
		return this.y;
	},
	jumpUpdate: function(){
		var velocity = this._jump.velocity;
		var new_y = this.y;
		if(this.currentState == "jumping"){

			velocity -= .05;
			if(velocity <= 0){
				velocity = 1;
				this.currentState = "godown";
				//console.log("godown");
			}
			else{
				new_y -= this._jump.power * velocity;
			}
			if(this.map.isPassable(this, this.x, new_y)){
				this._jump.velocity = velocity;
				this.y = new_y;
			}else{
				this.currentState = "godown";
			}
		}
		return this.y;
	},
	jump: function(state){

		if(state && this.currentState == "platform" ){
			this.currentState = "jumping";
		}
		else if(!state && this.currentState == "jumping"){
			this._jump.velocity = 1;
			this.currentState = "godown";
		}

	}
	
});
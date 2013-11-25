Class.create("Game_Entity", {
	speed: 5,
	x: 0,
	y: 0,
	frequence: 2,
	currentFrequence:0,
	dir:"right",
	initialize: function(x, y){
		this.x = x;
		this.y = y;
	},
	moveLoop: function(a, b){
		var new_x = this.x;
		if(this.currentFrequence >= this.frequence){
			if(new_x >=b){
				this.dir="left";
			}
			else if(new_x <= a){
				this.dir="right";
			}

			switch (this.dir){
				case "left":
					new_x -= this.speed;
					break;
				case "right":
					new_x += this.speed;
					break;
			}
			this.x = new_x;
			this.currentFrequence = 0;
		}
		this.currentFrequence++;
		return new_x;
	}

});

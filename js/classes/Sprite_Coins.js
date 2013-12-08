Class.create("Sprite_Coins",{
	el : null,
	initialize: function(id, scene, layer, data){
		this.id = id;
		this.el = scene.createElement(data.width, data.height);
		//this.el.setOriginPoint("middle");	
		//
		this.setPosition(data.x, data.y);

		var animation = canvas.Animation.new({
			images: "coin3",
			animations: {
				standard:{
					frames: [0,7],
					size:{
						width : 128,
						height: 128
					},
					frequence : 1
				}
			}
		});
		animation.add(this.el);
		animation.play("standard", "loop");

		this.on = canvas.Timeline.new(this.el).to({scaleX: 1,scaleY: 0.95}, 40, Ease.easeOutElastic);
		this.off = canvas.Timeline.new(this.el).to({scaleX: 1,scaleY: 1}, 40, Ease.easeOutElastic);

		layer.append(this.el);
	},
	setPosition: function(x, y){
		this.el.x = x;
		this.el.y = y;
	},
	hit: function(val){

		if(val){
			console.log("piece");
			
			this.on.call();
		}
		else{
			//this.off.call();
		}
	}
});
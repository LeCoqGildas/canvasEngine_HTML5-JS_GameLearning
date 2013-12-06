


Class.create("Game_Map", {
		map: null,
		entities:[],
		initialize: function(map){
			this.map = map;
		},
		addEntity: function(id, data){
			var entity = Class.new("Game_Entity", [data.x, data.y, data.width, data.height]);
			this.entities.push(entity);
			return entity;
		},
		isPassable: function(player, new_x, new_y){
			var ent;
			var self = this;

			if(new_x < 0 || (new_x + player.width) > this.map.getWidthPixel()){

				return false;
			}
			
			var tile_w = this.map.getTileWidth();
			var tile_h = this.map.getTileHeight();

			
			function pointIsPassableInTile(x,y){

				var map_x = Math.floor(x / tile_w );
				var map_y = Math.floor(y / tile_h );
			
				var props = self.map.getTileProperties(null, map_x, map_y);

				for( var i = 0; i < props.length; i++){
					if(props[i] && props[i].passable == "0"){

						return false;
					}
				}
				return true;
			}

			if ( !pointIsPassableInTile(new_x, new_y) 
				|| !pointIsPassableInTile(new_x + player.width, new_y)
				|| !pointIsPassableInTile(new_x , new_y + player.height)
				|| !pointIsPassableInTile(new_x + player.width, new_y + player.height)){
				return false;
			}

			//return true;

			function pointIsPassable(ent, x, y){
				if(x >= ent.x && x <= ent.x + ent.width && y >= ent.y && y <= ent.y + ent.height){
					ent.hit(true);//ref game_entity
					return false;
				}

				ent.hit(false);

				return true;
			}
			for(var i=0; i < this.entities.length; i++){
				ent = this.entities[i];
				if ( !pointIsPassable(ent, new_x, new_y) 
					|| !pointIsPassable(ent, new_x +player.width, new_y)
					|| !pointIsPassable(ent, new_x , new_y + player.height)
					|| !pointIsPassable(ent, new_x + player.width, new_y + player.height)){
					
					//non traversable
					//return false;
				}
			
			}
			return true;
		}	
});

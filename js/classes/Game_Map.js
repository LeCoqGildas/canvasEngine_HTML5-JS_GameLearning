


Class.create("Game_Map", {
		map: null,
		initialize: function(map){
			this.map = map;
		},
		isPassable: function(player, new_x, new_y){
			var ent, self = this;

			if(new_x < 0 || (new_x + player.width) > this.map.getWidthPixel()){

				return false;
			}
			
			var tile_w = this.map.getTileWidth();
			var tile_h = this.map.getTileHeight();

			
			function pointIsPassableInTile(x,y){

				var map_x = Math.floor(x / tile_w);
				var map_y = Math.floor(y / tile_h);

				var props = self.map.getTileProperties(null, map_x, map_y);
				for( var i = 0; i < props.length; i++){
					if(props[i] && props[i].passable == "0"){
						
						return false;
					}
				}
				return true;
			}
			if ( !pointIsPassableInTile(new_x, new_y) 
				|| !pointIsPassableInTile(new_x +player.width, new_y)
				|| !pointIsPassableInTile(new_x , new_y + player.height)
				|| !pointIsPassableInTile(new_x + player.width, new_y + player.height)){
				return false;
			}
			return true;
		}
		
	
});

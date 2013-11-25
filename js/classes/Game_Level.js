Class.create("Game_level", {
	_levels: [
		{stars: 0, score:0}
	],
	_currentLevel:0,
	getCurrentLevel: function(data) {
		if (data) {
			return this._worlds[this._currentWorls][this._currentLevel];
		}
		return this.currentLevel;
	},
	setCurrentLevel : function(id) {
		this._currentLevel = id;
	}
});

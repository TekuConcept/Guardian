var TIME_INT = 4;
var TIMEOUT = 1000 / TIME_INT; // 250 ms

function Guardian(_player_, _filter_) {
	this.monitoring = false;
	this.player = _player_;
	this.filter = _filter_;

	this.silence = function() {
		if(!this.player.isMuted())
			this.player.mute(); // mutes the player
	}

	this.speak = function() {
		if(this.player.isMuted())
			this.player.unMute(); // unmutes the player
	}

	this.skip = function(to) {

		this.player.seekTo(to, true); // skips a scene
	}

	this.getTime = function() {
		// returns time in seconds
		return Math.floor(this.player.getCurrentTime());
	}

	this.protect = function() {
		// continuously monitor player position
		console.log("Protecting...");
		if(!this.monitoring) {
			this.monitoring = true;
			loop(this, -1);
		}
	}

	this.halt = function() {
		// pause monitoring
		console.log("Protection has been halted!");
		this.monitoring = false;
	}
}

function loop(g, i) {
	if(g.monitoring) {
		// TODO: monitoring and execution code
		// 1. Get Current Time in the Video
		var index = g.getTime();

		// 2. Lookup Time-Stamp in Hashtable
		var key = "t_" + index;
		if(index != i && (key in g.filter))
		{
			var sifter = g.filter[key];

			// 3. Execute Hash Key Command
			if(sifter.mute) {
				g.silence();
			}
			else if(!sifter.mute) {
				g.speak();
			}
			if(sifter.skip)
				g.skip(sifter.skipTo);
		}

		//this.current_int = (this.current_int+1)%TIME_INT;
		setTimeout(function(){loop(g, index);}, TIMEOUT);
	}
}
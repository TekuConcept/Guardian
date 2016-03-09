var TIME_INT = 4;
var TIMEOUT = 1000 / TIME_INT; // 250 ms

function Guardian(_player_, _filter_) {
	this.monitoring = false;
	this.player = _player_;
	this.filter = _filter_;

	this.silence = function() {

		this.player.mute(); // mutes the player
	}

	this.speak = function() {
		if(this.player.isMuted())
			this.player.unMute(); // unmutes the player
	}

	this.skip = function() {

		this.player.seekTo(0, true); // skips a scene
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
		var index = Math.floor(g.player.getCurrentTime());

		// 2. Lookup Time-Stamp in Hashtable
		if(index != i)
			console.log(g.filter[index]);

		// 3. Execute Hash Key Command

		//this.current_int = (this.current_int+1)%TIME_INT;
		setTimeout(function(){loop(g, index);}, TIMEOUT);
	}
}
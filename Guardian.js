var TIME_INT = 4;
var TIMEOUT = 1000 / TIME_INT; // 250 ms

function Guardian(player) {
	this.current_int = 0;
	this.monitoring = false;
	this.player = player;

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
			loop(this);
		}
	}

	this.halt = function() {
		// pause monitoring
		console.log("Protection has been halted!");
		this.monitoring = false;
	}
}

function loop(g) {
	if(g.monitoring) {
		// TODO: monitoring and execution code
		console.log("looping..." + TIMEOUT);
		//this.current_int = (this.current_int+1)%TIME_INT;
		setTimeout(function(){loop(g);}, TIMEOUT);
	}
}
int TIMEOUT = 250; // 250 ms

function Guardian(player) {
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
		if(!monitoring) {
			monitoring = true;
			this.loop();
		}
	}

	this.halt = function() {
		// pause monitoring
		console.log("Protection has been halted!");
		monitoring = false;
	}

	this.loop = function() {
		if(monitoring) {
			// TODO: monitoring and execution code
			setTimeout(this.loop, TIMEOUT);
		}
	}
}
var TIME_INT = 4;
var TIMEOUT = 1000 / TIME_INT; // 250 ms

/*
	@brief  The main filter control over the YouTube player
	@param  _player_  YT.Player object which defines the YouTube
                      iFrame control.
	@param  _filter_  Filter object which holds the list of specific
	                  filters, and other useful data.
*/
function Guardian(_player_, _filter_) {
	this.monitoring = false;
	this.userUpdated= false;
	this.player = _player_;
	this.filter = _filter_;
	this.cIndex = 0;

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
		//console.log("Protecting... ");
		// check if we need to recall previous filter
		if((this.getTime() - this.cIndex) !== 0) {
			this.userUpdated = true;
		}

		if(!this.monitoring) {
			// resume normal filtering
			this.monitoring = true;
			loop(this, -1);
		}
	}

	this.halt = function(_ended_) {
		// pause monitoring
		//console.log("Protection has been halted!");
		this.monitoring = false;

		// reset user seek flag
		if(_ended_)
			this.userUpdated = false;
	}
}

function loop(g, i) {
	if(g.monitoring) {
		// TODO: monitoring and execution code
		// 1. Get Current Time in the Video
		g.cIndex = g.getTime();

		// 2. Lookup Time-Stamp in Hashtable
		var key = "t_" + g.cIndex;
		if(g.cIndex != i)
		{
			if(key in g.filter.list) {
				var sifter = g.filter.list[key];

				// 3a. Execute Hash Key Command
				if(sifter.mute) {
					g.silence();
				}
				else if(!sifter.mute) {
					g.speak();
				}
				if(sifter.skip)
					g.skip(sifter.skipTo);

				// if filter was found, no need to find the previous
				// key during the next loop call
				if(g.userUpdated)
					g.userUpdated = false;
			}
			else if(g.userUpdated) {
				// 3b. Check Nearest Key
				//     * If the user manually seeks to position
				//     that should be skipped or muted, we want
				//     to make  sure  the  filter  is  properly
				//     applied.
				console.log("User manually seeked to...");
				g.userUpdated = false;
			}
		}

		//this.current_int = (this.current_int+1)%TIME_INT;
		setTimeout(function(){loop(g, g.cIndex);}, TIMEOUT);
	}
}

function Sift(_mute_, _skip_, _to_) {
	this.mute = _mute_;
	this.skip = _skip_;
	this.skipTo = _to_;
}

/*
	@brief  Provides a list of filters, and functions for determining
	        things like current filter state.
	@param  _list_  A hash array with keys formatted as follows:
	                list["t_" + time_in_seconds];
*/
function Filter(_list_) {
	// Hash of 'Sift' objects
	this.list = _list_;
}
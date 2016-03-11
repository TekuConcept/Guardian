var TIME_INT = 10;
var TIMEOUT = 1000 / TIME_INT; // 100 ms

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
		return Math.round(this.player.getCurrentTime()*2)/2;
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

	this.execute = function(_sift_) {
		if(_sift_.mute)
			this.silence();
		else //if(!_sift_.mute)
			this.speak();
		// skip must be performed separately so that mute and skip
		// commands can be executed in one call
		if(_sift_.skip && this.cIndex < _sift_.skipTo) {
			this.skip(_sift_.skipTo);
		}
	}
}

function loop(g, i) {
	if(g.monitoring) {
		// TODO: monitoring and execution code
		// 1. Get Current Time in the Video
		g.cIndex = g.getTime();
		setTimeout(function(){loop(g, g.cIndex);}, TIMEOUT);

		// 2. Lookup Time-Stamp in Hashtable
		var key = "t_" + g.cIndex;
		if(g.cIndex != i)
		{
			if(key in g.filter.list) {
				var sifter = g.filter.list[key];
				g.execute(sifter);

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
				//console.log("User manually seeked to...");
				g.userUpdated = false;
				var idx = g.filter.nearest_left(g.cIndex);
				if(idx < 0) {  // no filters have been applied yet
					g.speak(); // reset speaker volume
				}
				else {
					var sifter = g.filter.getFromIndex(idx);
					g.execute(sifter);
				}
			}
		}
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
	this.list_index = new Array();
	this.list_size = 0;

	// add hash names to list
	this.init = function() {
		var i = 0;
		for(var tag in this.list) {
			this.list_index[i] = parseFloat(tag.substring(2));
			i++;
		}
		this.list_size = i;
		// sort in ascending
		this.list_index.sort(function(a, b){return a-b});
		//console.log(this.list_index);
		//console.log("Test: " + this.nearest_left(15));
	}

	this.getFromIndex = function(index) {

		return this.list["t_"+this.list_index[index]];
	}

	// returns the nearest left neighbor
	this.nearest_left = function(_key_) {
		var _min_ = 0;
		var _max_ = this.list_size;
		while(_min_ <= _max_) {
			var mid = Math.floor((_min_ + _max_) / 2);
			if(this.list_index[mid] <= _key_)
				_min_ = mid + 1;
			else
				_max_ = mid - 1;
		}
		return _max_;
	}
}
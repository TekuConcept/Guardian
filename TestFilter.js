function Sift(_mute_, _skip_, _to_) {
	this.mute = _mute_;
	this.skip = _skip_;
	this.skipTo = _to_;
}

var filter = new Object();
//filter['t_0'] = "And so it begins.";
filter['t_5'] = new Sift(true , false,  0);
filter['t_6'] = new Sift(false, false,  0);
filter['t_12']= new Sift(false, true , 20);
filter['t_25']= new Sift(true , false,  0);
filter['t_27']= new Sift(false, false,  0);
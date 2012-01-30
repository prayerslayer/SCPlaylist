(function( $ ){
	
	$.fn.SCPlaylist = function( options ) {  
		//stop sc-player
		$.scPlayer.onDomReady = null;

		//some vars
		var parent = this;								//the element were .SCPlaylist() was called on
		var settings = $.extend( {
	     	"tracks": ".track"
	    }, options);									//settings
	    var dom_tracks = $(settings.tracks, parent);	//the tracks in the DOM of parent
	    var count = dom_tracks.length;					//amount of those tracks
	    var tracks = new Array(count);					//array for sc-players
	    var active_track;								//currently playing track
	    var first_init = true;							//whether the first player initialized already or not
	    //methods
	    var methods = {
	    	//swaps two elements in an array
	    	swap: function(array, a, b) {
	    		if (a>=0 && b>=0) {
	    			var temp = array[a];
	    			array[a] = array[b];
	    			array[b] = temp;
	    		}
	    		else
	    			console.log("not in bounds:", a, b);
	    	},
	    	//actually no longer needed, but kept
	    	sortByDOM: function(array, dom) {
	    		if (array.length!=dom.length) {
	    			console.log("dom and array don't have same amount of tracks");
	    			return;
	    		}
	    		for (var i = 0; i < array.length; i++) {
	    			var track = array[i];
	    			var idx = $.inArray(track, dom);
	    			methods.swap(array, i, idx);
	    		}
	    	}
	    };
	    //do bindings
	    $(document).bind('onPlayerInit.scPlayer', function(event){
	    	//if it's the first player, collect tracks again (no links anymore, but sc-players)
	    	if(first_init) {
				first_init = false;
				dom_tracks = $(settings.tracks, parent); //get sc-players
			}
			var track = event.target;					
			var dom_idx = $.inArray(track, dom_tracks); //look up the location in dom
			tracks[dom_idx] = track;					//add track to tracks array
		});
	    $(document).bind('onPlayerPlay.scPlayer', function(event){
			active_track = event.target;				//set currently playing track
		});
	    $(document).bind('onMediaTimeUpdate.scPlayer', function(event){
			if ((event.duration - event.position)<=500) {
				//a track is over when there are less than 500 ms to go
				var idx = $.inArray(active_track, tracks);	//get index of currently playing track
				if (idx === tracks.length-1 || idx<0) {				
					//there are no more tracks or something went wrong
					console.log("exiting playlist with active index", idx);
					return; 	
				}
				do {
					idx++;
				}
				while (idx<tracks.length && tracks[idx]==null); //skip tracks that aren't ready
				$(".sc-play", tracks[idx]).first().click();		//play next track
			}
		});

	    //turn links into tracks
	    return dom_tracks.each(function() {
	    	$(this).scPlayer();
	    });
	}
})( jQuery );
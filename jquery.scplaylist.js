(function( $ ){
	
	$.fn.SCPlaylist = function( options ) {  
		//stop sc-player
		$.scPlayer.onDomReady = null;

		//some vars
		var parent = this;
		var settings = $.extend( {
	     	"tracks": ".track"
	    }, options);
	    var dom_tracks = $(settings.tracks, parent);
	    var tracks = new Array(count);
	    var count = dom_tracks.length;
	    var active_track;
	    var first_init = true;
	    //methods
	    var methods = {
	    	swap: function(array, a, b) {
	    		if (a>=0 && b>=0) {
	    			var temp = array[a];
	    			array[a] = array[b];
	    			array[b] = temp;
	    		}
	    		else
	    			console.log("not in bounds:", a, b);
	    	},
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
	    //bindings
	    $(document).bind('onPlayerInit.scPlayer', function(event){
	    	if(first_init) {
				first_init = false;
				dom_tracks = $(settings.tracks, parent); //get sc-players
			}
			var track = event.target;
			var dom_idx = $.inArray(track, dom_tracks); //look up the location in dom
			tracks[dom_idx] = track;
		});
	    $(document).bind('onPlayerPlay.scPlayer', function(event){
			active_track = event.target;
		});
	    $(document).bind('onMediaTimeUpdate.scPlayer', function(event){
			if ((event.duration - event.position)<=500) {
				var idx = $.inArray(active_track, tracks);
				if (idx === tracks.length-1) {
					return; 	//there are no more tracks
				}
				do {
					idx++;
				}
				while (idx<tracks.length && tracks[idx]==null); //skip tracks that aren't ready
				$(".sc-play", tracks[idx]).first().click();
			}
		});

	    //turn selections into tracks
	    return dom_tracks.each(function() {
	    	$(this).scPlayer();
	    });
	}
})( jQuery );
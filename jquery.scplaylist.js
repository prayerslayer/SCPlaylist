(function( $ ){
	//stop sc-player
	$.fn.SCPlaylist = function( options ) {  
		$.scPlayer.onDomReady = null;

		//some vars
		var parent = this;
		var tracks = new Array();
		var settings = $.extend( {
	     	"tracks": ".track"
	    }, options);
	    var dom_tracks = $(settings.tracks, parent);
	    var count = dom_tracks.length;
	    var active_track;
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
	    	tracks.push(event.target);
			count--;
			if (count<=0) {
				methods.sortByDOM(tracks, $(settings.tracks, parent)); //dom_tracks wouldn't work because they're all sc-players now
			}
		});
	    $(document).bind('onPlayerPlay.scPlayer', function(event){
			active_track = event.target;
		});
	    $(document).bind('onMediaTimeUpdate.scPlayer', function(event){
			if ((event.duration - event.position)<=500) {
				var idx = $.inArray(active_track, tracks);
				if (idx+1 < tracks.length) {
					$(".sc-play", tracks[idx+1]).first().click();
				}
			}
		});

	    //turn selections into tracks
	    return dom_tracks.each(function() {
	    	$(this).scPlayer();
	    });
	}
})( jQuery );
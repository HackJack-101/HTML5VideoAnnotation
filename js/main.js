window.video = null;

window.addEventListener('load', function()
{
    window.xmldata = null;
    window.frameRate = 29.970029;
    window.frameBlock = 15;

    window.video = document.getElementById("videoPlayer");


    window.counter = 0;

    window.video.addEventListener("loadedmetadata", function()
    {
	sizeElements();
	displayFrames();
	displayAllocatedFrames();
    }
    );


    window.video.addEventListener("play", function() {
	var button = document.getElementById("play");
	button.setAttribute("class", "fa fa-pause");
    }, false);

    window.video.addEventListener("pause", function() {
	var button = document.getElementById("play");
	button.setAttribute("class", "fa fa-play");
    }, false);

    window.onbeforeunload = function(e) {
	var e = e || window.event;

	// For IE and Firefox
	if (e) {
	    e.returnValue = "If you have not exported your annotation file yet, your work will be lost.";
	}

	// For Safari
	return "If you have not exported your annotation file yet, your work will be lost.";
    };
}, false);
function sizeElements()
{
    var canvas = document.getElementById("canvas");
    var videoContext = document.getElementById("videoContext");

    // HTML Size Attributes
    window.video.width = window.video.videoWidth;
    window.video.height = window.video.videoHeight;
    canvas.setAttribute("width", window.video.width);
    canvas.setAttribute("height", window.video.height);

    // PaperScope Size
    paper.view.size.height = window.video.height;
    paper.view.size.width = window.video.width;

    // Design Size Attributes
    document.getElementById("body").style.width = window.video.width + "px";
    canvas.style.width = window.video.width + "px";
    canvas.style.height = window.video.height + "px";
    videoContext.style.width = window.video.width + "px";
    videoContext.style.height = window.video.height + "px";
}

function getCurrentFrame()
{
    return Math.floor(window.video.currentTime * window.frameRate);
}

function play()
{
    if (window.video.paused)
	window.video.play();
    else
	window.video.pause();
}

function mute()
{
    var button = document.getElementById("mute");
    if (window.video.muted)
    {
	window.video.muted = false;
	button.setAttribute("class", "fa fa-volume-up");
    }
    else
    {
	window.video.muted = true;
	button.setAttribute("class", "fa fa-volume-off");
    }

}

function restart()
{
    window.video.currentTime = 0;
}

function skipValue(value)
{
    window.video.currentTime += value;
}

function goTo(value)
{
    window.video.currentTime = value;
}

function skip()
{
    var input = document.getElementById("startFrame");
    jumpToFrame(parseInt(input.value));
    return false;
}

function jumpToFrame(frameNumber)
{
    window.video.currentTime = frameNumber * 1.0 / window.frameRate;
}

function playRate()
{
    var input = document.getElementById("playRate");
    window.video.playbackRate = parseFloat(input.value);
    return false;
}

function defineFrameBlock()
{
    var input = document.getElementById("frameBlock");
    window.frameBlock = parseInt(input.value);
    return false;
}


function nextFrame()
{
    if (!window.video.paused)
	window.video.pause();
    var time = window.video.currentTime + (1.0 / window.frameRate);
    if (time > window.video.duration)
	window.video.currentTime = window.video.duration;
    else
	window.video.currentTime = time;
}

function previousFrame()
{
    if (!window.video.paused)
	window.video.pause();
    var time = window.video.currentTime - (1.0 / window.frameRate);
    if (time < 0)
	window.video.currentTime = 0;
    else
	window.video.currentTime = time;
}

function nextFrameBlock()
{
    if (!window.video.paused)
	window.video.pause();
    var time = window.video.currentTime + (1.0 / window.frameRate) * window.frameBlock;
    if (time > window.video.duration)
	window.video.currentTime = window.video.duration;
    else
	window.video.currentTime = time;
}

function previousFrameBlock()
{
    if (!window.video.paused)
	window.video.pause();
    var time = window.video.currentTime - (1.0 / window.frameRate) * window.frameBlock;
    if (time < 0)
	window.video.currentTime = 0;
    else
	window.video.currentTime = time;
}

function displayFrames()
{
    var seconds = parseInt(window.video.currentTime);
    var currentFrame = parseInt(window.video.currentTime % 1 / (1.0 / window.frameRate));

    var frameCounter = document.getElementById('frameCounter');
    frameCounter.innerHTML = getCurrentFrame();

    var decodedFrames = document.getElementById('decodedFrames');
    decodedFrames.innerHTML = window.video.webkitDecodedFrameCount;

    var droppedFrames = document.getElementById('droppedFrames');
    droppedFrames.innerHTML = window.video.webkitDroppedFrameCount;



    var minutes = document.getElementById('minutes');
    var minuteValue = parseInt(window.video.currentTime / 60);
    if (minuteValue < 10)
	minutes.innerHTML = "0" + minuteValue;
    else
	minutes.innerHTML = minuteValue;

    var hours = document.getElementById('hours');
    var hourValue = parseInt(window.video.currentTime / 3600);
    if (hourValue < 10)
	hours.innerHTML = "0" + hourValue;
    else
	hours.innerHTML = hourValue;

    var seconds = document.getElementById('seconds');
    var secondValue = parseInt(window.video.currentTime) % 60;
    if (secondValue < 10)
	seconds.innerHTML = "0" + secondValue;
    else
	seconds.innerHTML = secondValue;

    var subFrames = document.getElementById('subFrames');
    if (currentFrame < 10)
	subFrames.innerHTML = "0" + currentFrame;
    else
	subFrames.innerHTML = currentFrame;

    var playBar = document.getElementById('playBar');
    playBar.setAttribute("value", window.video.currentTime * 100 / window.video.duration);

    setTimeout(function() {
	displayFrames();
    }, 0);
}

function displayAllocatedFrames()
{
    var allocatedFrames = document.getElementById('allocatedFrames');
    if (window.framesAllocated)
    {
	window.framesAllocated.sort();
	var content = "";
	for (var i = 0; i < window.framesAllocated.length; i++)
	{
	    content += '<a href="#videoPlayer" class="button" onclick="jumpToFrame(' + window.framesAllocated[i] + ')">' + window.framesAllocated[i] + '</a>';
	}
	allocatedFrames.innerHTML = content;

    }

    setTimeout(function() {
	displayAllocatedFrames();
    }, 500);
}
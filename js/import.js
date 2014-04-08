function importXML(event) {
	var input = event.target;
	var reader = new FileReader();
	reader.onload = function(event)
	{
		var textXML = event.target.result;
		console.log(textXML);
		if (window.DOMParser)
		{
			var parser = new DOMParser();
			var xml = parser.parseFromString(textXML, "text/xml");
		}
		else // Internet Explorer
		{
			var xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = false;
			xml.loadXML(textXML);
		}
		var video = xml.documentElement;
		var height = parseInt(video.getAttribute('height'));
		var width = parseInt(video.getAttribute('width'));
		var framerate = parseFloat(video.getAttribute('framerate'));
		var categories = video.firstChild.childNodes;
		var categoryId = [];
		categoryId[0] = 0;
		for (var i = 0; i < categories.length; i++)
		{
			categoryId.push(categories[i].firstChild.innerHTML);
		}
		var boundingBoxes = video.lastChild.childNodes;
		var data = [];
		for (var j = 0; j < boundingBoxes.length; j++)
		{
			var boundingBox = new Object();
			boundingBox.x = parseFloat(boundingBoxes[j].childNodes[0].innerHTML);
			boundingBox.y = parseFloat(boundingBoxes[j].childNodes[1].innerHTML);
			boundingBox.width = parseFloat(boundingBoxes[j].childNodes[2].innerHTML);
			boundingBox.height = parseFloat(boundingBoxes[j].childNodes[3].innerHTML);
			boundingBox.category = categoryId[parseInt(boundingBoxes[j].getAttribute('categoryId'))];
			boundingBox.frameNumber = parseInt(boundingBoxes[j].getAttribute('frameNumber'));
			data.push(boundingBox);
		}
		window.video.height = height;
		window.video.width = width;
		sizeElements();
		window.frameRate = framerate;
		window.paper.tool.importXML(data);
	};
	reader.readAsText(input.files[0]);
}
function createAndOpenFile(categoriesData, data) {
	var video = document.createElement('video');
	/********** video width ************/
	var width = document.createAttribute('width');
	width.value = window.video.width;
	video.setAttributeNode(width);
	/********** video height ************/
	var height = document.createAttribute('height');
	height.value = window.video.height;
	video.setAttributeNode(height);
	/********** video height ************/
	var height = document.createAttribute('height');
	height.value = window.video.height;
	video.setAttributeNode(height);
	/********** frame rate ************/
	var framerate = document.createAttribute('framerate');
	framerate.value = parseFloat(window.frameRate);
	video.setAttributeNode(framerate);
	/********** xmlns ************/
	video.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
	/********** schemaLocation ************/
	video.setAttribute('xsi:noNamespaceSchemaLocation', 'http://hackjack.info/PdP/data/videoXMLstructure.xsd');

	var boundingBoxes = document.createElement('boundingBoxes');
	var categories = document.createElement('categories');
	for (var j = 1; j < categoriesData.length; j++)
	{
		console.log(j);
		var category = document.createElement('category');

		var id = document.createAttribute('id');
		id.value = j;
		category.setAttributeNode(id);

		var name = document.createElement('name');
		name.innerHTML = categoriesData[j];
		category.appendChild(name);

		categories.appendChild(category);
	}
	video.appendChild(categories);
	for (var i = 0; i < data.length; i++)
	{
		var boundingBox = document.createElement('boundingBox');

		/********** frameNumber ************/
		var frameNumber = document.createAttribute('frameNumber');
		frameNumber.value = data[i].frameNumber;
		boundingBox.setAttributeNode(frameNumber);
		/********** categoryId ************/
		var categoryId = document.createAttribute('categoryId');
		categoryId.value = data[i].categoryId;
		boundingBox.setAttributeNode(categoryId);
		/********** x ************/
		var x = document.createElement('x');
		x.innerHTML = data[i].x;
		boundingBox.appendChild(x);
		/********** y ************/
		var y = document.createElement('y');
		y.innerHTML = data[i].y;
		boundingBox.appendChild(y);
		/********** width ************/
		var width = document.createElement('width');
		width.innerHTML = data[i].width;
		boundingBox.appendChild(width);
		/********** height ************/
		var height = document.createElement('height');
		height.innerHTML = data[i].height;
		boundingBox.appendChild(height);

		console.log(boundingBox);
		boundingBoxes.appendChild(boundingBox);
	}
	video.appendChild(boundingBoxes);
	var serializer = new XMLSerializer();
	var stupidExample = '<?xml version="1.0" encoding="utf-8"?>' + serializer.serializeToString(video);
//	window.open('data:application/octet-stream;filename=annotations.xml,' + encodeURIComponent(stupidExample), 'annotations.xml');
	window.open('data:text/xml;filename=annotations.xml,' + encodeURIComponent(stupidExample), '_blank');
}
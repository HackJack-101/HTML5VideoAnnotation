var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
};
var hitTextOptions = {
	segments: false,
	stroke: false,
	fill: false,
	tolerance: 0
};

var segment, path;
var movePath = false;
var pathRect = null;
var lastItemHover = null;
var annotationsCounter = 1;

window.layers = [];
window.framesAllocated = [];
window.currentCategory = null;
window.annotationContext = false;
window.previousLayer = null;
window.activeFrame = null;

function onMouseDown(event)
{
	segment = path = null;
	var hitResult = project.hitTest(event.point, hitOptions);
	project.activeLayer.selected = false;

	if (hitResult) // Test if user click on a structure
	{

		if (Object.getPrototypeOf(hitResult.item)._class != "PointText")
		{
			path = hitResult.item;
			path.selected = true;
		}
		else
		{
			segment = path = pathRect = null;
			window.currentCategory = hitResult.item;
			openModalBox(hitResult.item.content, tool.getAnnotations());
		}
		if (hitResult.type == 'segment')
			segment = hitResult.segment;
	}
	else // Creation of an area
	{
		if (!window.video.paused)
			window.video.pause();
		else
		{

			var currentFrame = window.getCurrentFrame();
			if (!window.layers[currentFrame])
			{
				window.layers[currentFrame] = new Layer();
				window.framesAllocated.push(currentFrame);
			}
			pathRect = new Path.Rectangle(new Rectangle(event.point, event.point));
			pathRect.fillColor = new Color(1, 1, 1, 0.05);
			pathRect.strokeColor = new Color(1, 0, 0);
			pathRect.selected = true;
			pathRect.category = new PointText({
				point: pathRect.bounds.center + new Point(0, Math.round((pathRect.bounds.height + 35) / 2)),
				justification: 'center',
				fontSize: 25,
				fillColor: 'white',
				strokeColor: 'black',
				strokeWidth: 1
			});
		}
	}
}

function onMouseMove(event) {
	if (event.item)
	{
		if (Object.getPrototypeOf(event.item)._class != "PointText")
		{
			if (lastItemHover)
			{
				if (!event.item.equals(lastItemHover))
				{
					lastItemHover.strokeColor = new Color(1, 0, 0);
					lastItemHover.strokeWidth = 1;
					event.item.strokeColor = new Color(0.3, 0.48, 1);
					event.item.strokeWidth = 2;
					lastItemHover = event.item;
				}
			}
			else
			{
				event.item.strokeColor = new Color(0.3, 0.48, 1);
				event.item.strokeWidth = 2;
				lastItemHover = event.item;
			}
		}
	}
	else
	{
		lastItemHover = null;
		for (var i = 0; i < project.activeLayer.children.length; i++)
		{
			if (Object.getPrototypeOf(project.activeLayer.children[i])._class != "PointText")
			{
				project.activeLayer.children[i].strokeColor = new Color(1, 0, 0);
				project.activeLayer.children[i].strokeWidth = 1;
			}
		}
	}
}

function onMouseDrag(event)
{
	var width = view.size.width;
	var height = view.size.height;

	var deltaX = event.delta.x;
	var deltaY = event.delta.y;


	if (segment) // Resize an area from one of its corners
	{
		if (segment.point.x + deltaX > width)
			deltaX = width - segment.point.x;
		else if (segment.point.x + deltaX < 0)
			deltaX = 0 - segment.point.x;
		if (segment.point.y + deltaY > height)
			deltaY = height - segment.point.y;
		if (segment.point.y + deltaY < 0)
			deltaY = 0 - segment.point.y;

		segment.point.x += deltaX;
		segment.point.y += deltaY;
		switch (segment.index)
		{
			// Top left and bottom right corners
			case 1 :
			case 3 :
				segment.next.point.y += deltaY;
				segment.previous.point.x += deltaX;
				break;
				// Top right and bottom left corner
			default:
				segment.next.point.x += deltaX;
				segment.previous.point.y += deltaY;
				break;
		}

		if (segment.path.bounds.bottom + segment.path.category.fontSize + 10 < view.size.height)
			segment.path.category.position = segment.path.bounds.center + new Point(0, Math.round((segment.path.bounds.height + segment.path.category.fontSize + 10) / 2));
		else
			segment.path.category.position = segment.path.bounds.center - new Point(0, Math.round((segment.path.bounds.height + segment.path.category.fontSize + 10) / 2));
	}
	else if (path) // Move an area
	{
		path.position += event.delta;
		for (var i = 0; i < 4; i++)
		{
			if (path.segments[i].point.x <= 0)
				path.segments[i].point.x = 0;
			else if (path.segments[i].point.x >= width)
				path.segments[i].point.x = width;
			if (path.segments[i].point.y <= 0)
				path.segments[i].point.y = 0;
			else if (path.segments[i].point.y >= height)
				path.segments[i].point.y = height;
		}
		if (path.bounds.bottom + path.category.fontSize + 10 < view.size.height)
			path.category.position = path.bounds.center + new Point(0, Math.round((path.bounds.height + path.category.fontSize + 10) / 2));
		else
			path.category.position = path.bounds.center - new Point(0, Math.round((path.bounds.height + path.category.fontSize + 10) / 2));
	}
	else if (pathRect) // Size an area
	{
		// Get the bottom right corner of the area
		var segmentTmp = pathRect.segments[3];

		if (segmentTmp.point.x + deltaX > width)
			deltaX = width - segmentTmp.point.x;
		else if (segmentTmp.point.x + deltaX < 0)
			deltaX = 0 - segmentTmp.point.x;
		if (segmentTmp.point.y + deltaY > height)
			deltaY = height - segmentTmp.point.y;
		if (segmentTmp.point.y + deltaY < 0)
			deltaY = 0 - segmentTmp.point.y;

		segmentTmp.point.x += deltaX;
		segmentTmp.point.y += deltaY;
		segmentTmp.next.point.y += deltaY;
		segmentTmp.previous.point.x += deltaX;

		if (pathRect.bounds.bottom + pathRect.category.fontSize + 10 < view.size.height)
			pathRect.category.position = pathRect.bounds.center + new Point(0, Math.round((pathRect.bounds.height + pathRect.category.fontSize + 10) / 2));
		else
			pathRect.category.position = pathRect.bounds.center - new Point(0, Math.round((pathRect.bounds.height + pathRect.category.fontSize + 10) / 2));
	}
}

function onMouseUp(event)
{
	if (pathRect)
	{
		if (Math.abs(pathRect.area) < 20)
		{
			pathRect.category.remove();
			pathRect.remove();
		}
		else
		{
			pathRect.category.content = "annotation_" + annotationsCounter.toString();
			annotationsCounter++;
		}
		pathRect.selected = false;
		pathRect = null;
	}
}

tool.getAnnotations = function()
{
	var exitingCategories = new Object();
	var categories = [];
	for (var i = 0; i < window.framesAllocated.length; i++)
	{
		var f = window.framesAllocated[i];
		var children = window.layers[f].children;
		for (var j = 0; j < children.length; j++)
		{
			if (Object.getPrototypeOf(children[j])._class != "PointText")
			{
				var category = children[j].category.content;
				if (typeof exitingCategories[category] == 'undefined')
				{
					categories.push(category);
					exitingCategories[category] = 1;
				}
			}
		}
	}
	return categories.sort();
};

tool.editAnnotation = function(content)
{
	window.currentCategory.content = content;
};

tool.exportXML = function()
{
	var data = [];
	var exitingCategories = new Object();
	var categories = [];
	categories[0] = 0;
	for (var i = 0; i < window.framesAllocated.length; i++)
	{
		var f = window.framesAllocated[i];
		var children = window.layers[f].children;
		for (var j = 0; j < children.length; j++)
		{
			if (Object.getPrototypeOf(children[j])._class != "PointText")
			{
				var category = children[j].category.content;
				if (typeof exitingCategories[category] == 'undefined')
				{
					categories.push(category);
					exitingCategories[category] = categories.length - 1;
				}
				var child = new Object();
				child.x = children[j].bounds.x;
				child.y = children[j].bounds.y;
				child.width = children[j].bounds.width;
				child.height = children[j].bounds.height;
				child.categoryId = exitingCategories[category];
				child.frameNumber = f;
				data.push(child);
			}
		}

	}
	createAndOpenFile(categories, data);
};

tool.importXML = function(data)
{
	if (!window.layers)
		window.layers = new Array();
	for (var i = 0; i < data.length; i++)
	{
		var frameNumber = data[i].frameNumber;
		if (frameNumber >= 0)
		{
			if (!window.layers[frameNumber])
			{
				window.layers[frameNumber] = new Layer();
				window.framesAllocated.push(frameNumber);
				project.activeLayer.visible = false;
			}
			else
			{
				window.layers[frameNumber].activate();
				window.layers[frameNumber].visible = false;
			}

			var annotation = new Path.Rectangle(new Rectangle(data[i].x, data[i].y, data[i].width, data[i].height));
			annotation.fillColor = new Color(1, 1, 1, 0.05);
			annotation.strokeColor = new Color(1, 0, 0);
			annotation.selected = false;
			annotation.category = new PointText({
				point: annotation.bounds.center + new Point(0, Math.round((annotation.bounds.height + 35) / 2)),
				justification: 'center',
				fontSize: 25,
				fillColor: 'white',
				strokeColor: 'black',
				strokeWidth: 1
			});
			annotation.category.content = data[i].category;
		}
	}
	var currentFrame = window.getCurrentFrame();
	if(window.layers[currentFrame])
		window.layers[currentFrame].visible = true;
	window.alert("Le fichier d'annotation a été bien été chargé.");
};

tool.copyLayer = function()
{
	if (window.previousLayer != null)
	{
		var currentFrame = window.getCurrentFrame();
		if (!window.layers[currentFrame])
		{
			window.layers[currentFrame] = new Layer();
			window.framesAllocated.push(currentFrame);
		}
		var children = window.previousLayer.children;
		for (var i = 0; i < children.length; i++)
		{
			if (Object.getPrototypeOf(children[i])._class != "PointText")
			{
				var clone = new Path.Rectangle(new Rectangle(children[i].bounds.x, children[i].bounds.y, children[i].bounds.width, children[i].bounds.height));
				clone.fillColor = new Color(1, 1, 1, 0.05);
				clone.strokeColor = new Color(1, 0, 0);
				clone.selected = false;
				clone.category = new PointText({
					point: clone.bounds.center + new Point(0, Math.round((clone.bounds.height + 35) / 2)),
					justification: 'center',
					fontSize: 25,
					fillColor: 'white',
					strokeColor: 'black',
					strokeWidth: 1,
				});
				clone.category.content = children[i].category.content;
			}
		}
	}
};

function onKeyDown(event)
{
	if (!window.annotationContext)
	{
		switch (event.key)
		{
			case 's':
				tool.exportXML();
				break;
			case 'q':
				window.previousFrameBlock();
				break;
			case 'd':
				window.nextFrameBlock();
				break;
			case 'c':
				tool.copyLayer();
				break;
			case 'n':
				if (path)
				{
					window.currentCategory = path.category;
					openModalBox(path.category.content, tool.getAnnotations());
				}
				else if (pathRect)
				{
					window.currentCategory = pathRect.category;
					openModalBox(pathRect.category.content, tool.getAnnotations());
				}
				break;
			case 't':
				console.log(project);
				console.log(project.layers);
				console.log(view);
				break;
			case 'delete':
				if (path)
				{
					path.category.remove();
					path.remove();
				}
				else if (pathRect)
				{
					pathRect.category.remove();
					pathRect.remove();
				}
				break;
			case 'p':
				if (window.video.paused)
					window.video.play();
				else
					window.video.pause();
				break;
			default:
				break;
		}
	}
}

tool.frameLayer = function()
{
	var currentFrame = window.getCurrentFrame();
	if (!window.layers)
		window.layers = new Array();
	if (window.video.paused)
	{
		if (window.activeFrame == null || window.activeFrame != currentFrame)
		{
			window.activeFrame = currentFrame;
			if (!window.layers[currentFrame])
			{
				window.previousLayer = project.activeLayer;
				for (var i = 0; i < window.framesAllocated.length; i++)
					window.layers[window.framesAllocated[i]].visible = false;
			}
			else
			{
				for (var i = 0; i < window.framesAllocated.length; i++)
					window.layers[window.framesAllocated[i]].visible = false;
				window.previousLayer = project.activeLayer;
				window.layers[currentFrame].activate();
				window.layers[currentFrame].visible = true;
			}
		}
	}
	else
	{
		project.activeLayer.visible = false;
	}
	setTimeout(function() {
		tool.frameLayer();
	}, 0);
};

tool.frameLayer();
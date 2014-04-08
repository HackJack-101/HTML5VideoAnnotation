$(function() {

	var autoComplete,
			dialog = $("#dialog"),
			input = $("#annotation");

	input.autocomplete({
		source: []
	});

	autoComplete = input.autocomplete("widget");

	dialog.dialog({
		modal: true,
		draggable: false,
		autoOpen: false
	});
	dialog.bind('dialogclose', function(e) {
		window.annotationContext = false;
	});
	dialog.keypress(function(e) {
		if (e.keyCode == $.ui.keyCode.ENTER) {
			closeModalBox();
		}
	});

	autoComplete.insertAfter(dialog.parent());

});


function openModalBox(previousContent, categories)
{
	window.annotationContext = true;
	$("#dialog").dialog('open');
	$("#dialog").focus();
	$("#annotation").val(previousContent);
	var autoComplete = $("#annotation").autocomplete("option", "source", categories);
}

function closeModalBox()
{
	$("#dialog").dialog('close');
	window.annotationContext = false;
	window.paper.tool.editAnnotation($("#annotation").val());
}
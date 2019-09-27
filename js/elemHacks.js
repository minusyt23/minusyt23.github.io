var menuDiv = document.getElementById("menu");

var editorDiv = document.getElementById("editorDiv");

var modeDiv = document.getElementById("modeDiv");

function setMode(number)
{
	modeDiv.scrollTop = parseInt(number)*342;
};
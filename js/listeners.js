function editorMouseMoveCall(event)
{
	editor.mousePos = [event.clientX,event.clientY]
	if (editor.mLC) {editor.place();}
};



editor.canvas.addEventListener("mousemove", editorMouseMoveCall)
editor.canvas.addEventListener("mousedown", function(){if(event.button === 0) {editor.place(); editor.mLC = true;}})
editor.canvas.addEventListener("mouseup", function(){if(event.button === 0) {editor.mLC = false;}})

editor.resize()
function resizeCall (event)
{
	editor.resize()
	largeCanvasDiv.style.width = (window.innerWidth - (256 + (window.innerWidth & (editor.SF() - 1)))) + "px";
	toolDiv.style.left = (window.innerWidth - (256 + (window.innerWidth & (editor.SF() - 1)))) + "px";
}

window.addEventListener("resize",resizeCall)

function scrollCanvasCall (event)
{
	editor.canvas.style.left = largeCanvasDiv.scrollLeft + "px";
	editor.xoffset = editor.RF(largeCanvasDiv.scrollLeft);
} 

largeCanvasDiv.addEventListener("scroll",scrollCanvasCall)
//menuDiv.addEventListener("mousemove",resizeCall)

	largeCanvasDiv.style.width = (window.innerWidth - (256 + (window.innerWidth & (editor.SF() - 1)))) + "px";
	toolDiv.style.left = (window.innerWidth - (256 + (window.innerWidth & (editor.SF() - 1)))) + "px";

recentContainer.addEventListener("mousemove", function(e){recent.mousePos = [e.offsetX,e.offsetY]});
recentContainer.addEventListener("mousedown", function(e){if (e.button === 0) {recent.mLC = true;}});
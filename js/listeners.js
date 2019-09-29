

editor.resize()
function resizeCall (event)
{
	editor.resize()
}

window.addEventListener("resize",resizeCall)

function scrollCanvasCall (event)
{
	editor.canvas.style.left = largeCanvasDiv.scrollLeft + "px";
	editor.xoffset = editor.RF(largeCanvasDiv.scrollLeft);
} 

largeCanvasDiv.addEventListener("scroll",scrollCanvasCall)
//menuDiv.addEventListener("mousemove",resizeCall)

recentContainer.addEventListener("mousemove", function(e){recent.mousePos = [e.offsetX,e.offsetY]});
recentContainer.addEventListener("mousedown", function(e){if (e.button === 0) {recent.mLC = true;}});
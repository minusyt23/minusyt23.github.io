var menuDiv = document.getElementById("menu");
var editorDiv = document.getElementById("editorDiv");
var largeCanvasDiv = document.getElementById("largeCanvas");
var scrollCanvasDiv = document.getElementById("scrollCanvas");
var modeDiv = document.getElementById("modeDiv");
var recentDiv = document.getElementById("recentDiv");

var recentfileDiv = document.getElementById("recentDiv");

var json = JSON.parse('{"type":"game","mode":"royale","shortname":"1","fileid":"'+Math.random().toString(16).substr(2,8)+Math.random().toString(16).substr(2,8)+'","resource":[{"id":"map","src":"img/game/smb_map.png"},{"id":"obj","src":"img/game/smb_obj.png"}], "initial": 0, "world": [{"id": 0, "name": "World 1", "initial": 0, "zone": [{"id": 0, "initial": 196608, "color": "#6B8CFF", "music": "music/main0.mp3", "layers": [{"z": 0, "data": [[0, 1],[30, 30]]}, {"z": 1, "data": [[30, 30],[2, 3]]}], "obj": [], "warp": []}]}]}');

var mapimg = new Image();
mapimg.onload = function(){};
mapimg.src = "http://marioroyale.cyuubi.gq/img/game/smb_map.png";

objimg = new Image();
objimg.onload = function(){};
objimg.src = "http://marioroyale.cyuubi.gq/img/game/smb_obj.png";

//DECODE TILE DATA
function DTD(tiledata){return {spi: tiledata & 0x7ff, bnc: tiledata >> 0xb & 0xf, dph: tiledata >> 0xf & 0x1, tdf: tiledata >> 0x10 & 0xff, xdt: tiledata >> 0x18 & 0xff};};
//ENCODE TILE DATA
function ETD(spri,bmp,dpt,tldf,exdt){return 0 | (spri & 0x000007FF) | ((bmp << 11) & 0x00007800) | (((dpt?1:0) << 15) & 0x00008000) | ((tldf << 16) & 0x00FF0000) | ((exdt << 24) & 0xFF000000);};
// GET POS BY INDEX
function GPI(spr_index){var x = spr_index % (mapimg.width / 16);return [x*16,((spr_index-x)/(mapimg.width / 16))* 16];};
// GET ARRAY SIZES
function A2W(array) {return array[0].length;};
function A2H(array) {return array.length;};

editor = new ed();
recent = new rec();

function ed ()
{
	this.canvas = document.getElementById("visualCanvas");
	this.display = this.canvas.getContext("2d");
	this.display.imageSmoothingEnabled=false;

	this.scale = 2;

	this.xoffset = 0;

	this.l = 0;
	this.z = 0;
	this.y = 0;

	this.zdata = json.world[this.l].zone[this.z];
};

ed.prototype.clearScreen = function (color)
{
	this.display.globalAlpha = 1.0;
	this.display.clearRect(0,0,this.display.canvas.width, this.display.canvas.height);
	this.display.fillStyle = color;
	this.display.fillRect(0,0,this.canvas.width,this.canvas.height);
};

ed.prototype.drawMap = function () 
{
	for (var l = 0; l < this.zdata.layers.length; l++) {
		if (l == this.y) {this.display.globalAlpha = 1.0} else {this.display.globalAlpha = 0.5};
		for (var y = 0; y < A2H(this.zdata.layers[l].data); y++) {
			for (var x = (this.RF(visualCanvas.clientWidth) >= A2W(this.zdata.layers[l].data)) ? 0 : this.xoffset; 
				(this.RF(visualCanvas.clientWidth) >= A2W(this.zdata.layers[this.y].data)) ? x < A2W(this.zdata.layers[this.y].data) : x < this.RF(visualCanvas.clientWidth)+this.xoffset; x++) {
					this.display.drawImage(mapimg,...GPI(DTD(this.zdata.layers[l].data[y][x]).spi),16,16,
										   this.SF(x)-this.SF(this.xoffset),this.SF(y),this.SF(),this.SF());
			}
		}
	}
};

ed.prototype.update = function ()
{
	this.display.imageSmoothingEnabled=false;
	this.zdata = json.world[this.l].zone[this.z];
	this.clearScreen(this.zdata.color);
	this.drawMap();
};

ed.prototype.S = function(num = 1)  // SCALED
{
	return num*this.scale;
};

ed.prototype.SF = function(num = 1) // SCALED FIXED
{
	return num*16*this.scale;
};

ed.prototype.R = function(num = 1) // ROUNDED
{
	return Math.floor(num/this.scale);
};

ed.prototype.RF = function(num = 1) // ROUNDED FIXED
{
	return Math.floor(num/(16*this.scale));
};

ed.prototype.resize = function ()
{
	this.canvas.width = editorDiv.clientWidth;
	this.canvas.height = editorDiv.offsetHeight;
};

function rec ()
{
	this.canvas = document.getElementById("recentContainer");
	this.display = this.canvas.getContext("2d");
	this.canvas.width = 400-24;
	this.mousePos = [0,0];
	this.mLC = false;
};

rec.prototype.clearScreen = function ()
{
	this.display.globalAlpha = 1.0;
	this.display.clearRect(0,0,this.display.canvas.width, this.display.canvas.height);

};

rec.prototype.update = function()
{
	this.clearScreen();
	this.canvas.style.height = localStorage.length * 24 + "px";
	this.canvas.height = localStorage.length * 24;
	
	for (var world = 0; world < localStorage.length; world++) {
		var parsed = JSON.parse(localStorage.getItem(localStorage.key(world)));
		this.collide(0,24*world,400,24) ? this.display.fillStyle = "#A060A0" : this.display.fillStyle = "#EFEFEF"
		this.display.fillRect(0,24*world,400,24)
		this.collide(0,24*world,400,24) ? this.display.fillStyle = "#EFEFEF" : this.display.fillStyle = "#000000"
		this.display.font = "14pt Arial";
		this.display.fillText(" World "+ parsed.shortname, 0,24*world+18)
		this.display.font = "8pt Consolas";
		this.display.fillText(parsed.fileid, 260,24*world+16)
		if (this.collide(0,24*world,400,24) && this.mLC) {this.mLC = false; updateJson(parsed)}
	}
};

rec.prototype.collide = function(x,y,w,h)
{
	return this.mousePos[0] <= x+w && this.mousePos[0] > x && this.mousePos[1] <= y+h && this.mousePos[1] > y;
};

function updateCall ()
{
	editor.update();
	recent.update();
	requestAnimationFrame(updateCall);
};

updateCall();


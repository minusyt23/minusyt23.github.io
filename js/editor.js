var json = JSON.parse('{"type":"game","mode":"royale","shortname":"1","resource":[{"id":"map","src":"img/game/smb_map.png"},{"id":"obj","src":"img/game/smb_obj.png"}], "initial": 0, "world": [{"id": 0, "name": "World 1", "initial": 0, "zone": [{"id": 0, "initial": 196608, "color": "#6B8CFF", "music": "music/main0.mp3", "layers": [{"z": 0, "data": [[0, 1],[30, 30]]}, {"z": 1, "data": [[30, 30],[2, 3]]}], "obj": [], "warp": []}]}]}');

var editor =
{
	a: 0,
	b: function()
	{
		console.log(this)
	}
}
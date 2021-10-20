var colindex = 0;
var rackindex = 0;

var rack = function (unit,unittype,unittitle) {

	var rackid = "rack"+rackindex
	rackindex++
	var parts = Parts[unittype]

	var container = document.createElement("div")
	container.setAttribute("class", "rackunit")
	container.id = rackid
	document.body.appendChild(container)

	var title = document.createElement("div")
	title.setAttribute("class", "racktitle")
	title.innerHTML = unittitle ? unittitle : unittype
	container.appendChild(title)


	for (var i=0;i<parts.length;i++) {

		var col = document.createElement("div")
		col.setAttribute("class", "rackcol")
		col.id = "col"+colindex
		colindex++
		container.appendChild(col)

		var widget = nx.add(parts[i].type,{
			parent: col.id,
			w: parts[i].size ? parts[i].size.w : false,
			h: parts[i].size ? parts[i].size.h : false
		});
		widget.unit = unit

		var action = parts[i].action
		action = action.bind(widget)
		widget.on('*', action)
		if (parts[i].initial) {
			console.log(widget.canvasID)
			widget.set(parts[i].initial)
		}

		var label = document.createElement("div")
		label.setAttribute("class", "racklabel")
		label.innerHTML = parts[i].label
		col.appendChild(label)

	}

}



function customCSS() {
	var customcss = document.createElement("style")
	customcss.innerHTML = ".rackunit { border: solid 1px #ddd; background-color:#fff; padding: 20px 20px 5px 20px; display: inline-block; position:relative } "
	customcss.innerHTML += ".rackcol { margin: 2px; padding: 2px; display: inline-block } "
	customcss.innerHTML += ".racklabel { text-align: center; font: normal 12px courier; color:#888; padding: 4px } "
	customcss.innerHTML += ".racktitle { font: normal 10px courier; color: #888; text-align:left; padding: 3px 6px; margin:2px; position:absolute; top:0px; left:0px; } "
	document.head.appendChild(customcss)
}

customCSS();





var Parts = {
	"player": [
		{
			label: "on/off",
			type: "toggle",
			action: function(data) {
				if (data.value) {
					this.unit.start();
				} else {
					this.unit.stop();
				}
			}
		},{
			label: "vol",
			type: "dial",
			action: function(data) {
				this.unit.setVolume(nx.scale(data.value,0,1,-96,5));
			},
			initial: {
				"value": 0.95
			}
		},{
			label: "loop",
			type: "toggle",
			action: function(data) {
				this.unit.setLoop(data.value);
			}
		},{
			label: "loop points",
			type: "range",
			action: function(data) {
				this.unit.setLoopPoints(data.start*this.unit.duration,data.stop*this.unit.duration)
			}
		},{
			label: "speed",
			type: "dial",
			action: function(data) {
				this.unit.setPlaybackRate(data.value*2,0.7);
			},
			initial: {
				"value": 0.5
			}
		}
	],
	"pingpongdelay": [
		{
			label: "feedback / delay",
			type: "position",
			action: function(data) {
				this.unit.setDelayTime(data.x*2,10)
				this.unit.setFeedback(data.y*0.99)
			},
			size: {
				w: 150,
				h: 50
			}
		}
	],
	"panner": [
		{
			label: "pan",
			type: "metro",
			action: function(data) {
			//	console.log(data.beat);
				this.unit.setPan(data.beat);
			},
			size: {
				w: 200,
				h: 25
			}
		}
	]
}
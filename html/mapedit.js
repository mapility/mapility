
var ContaoMapEditor = new Class({
	Extends: ContaoMap,
	initialize:function(container, options)
	{
		this.parent(container, options);
	},
	addEditActions:function(container)
	{
		opts={
				'addpolygon':{'name':'Add Polygon', 'func':this.addpolygon.bind(this)},
//				'addmarker':{'name':'Add Marker', 'func':this.addmarker.bind(this)},
				'savemap':{'name':'Save', 'func':this.save.bind(this)}
		};
		this.createToolbar(container, opts);
		this.getLayer('edit', true);
		return this;
	},
	createToolbar:function(obj,items){
		for(var p in items){
			i=Element('li', {'class':'tl_googlemapeditor_'+p});
			a=Element('a', {'class':'tl_googlemapeditor_'+p, 'title':items[p].name});
			i.appendChild(a);
			a.innerHTML=items[p].name;
			a.addEvent('click', items[p].func);
			obj.appendChild(i);
		}
		return this;
	},
	addpolygon:function(){
		//lests create circle
		var polydata=[];
		var Nverts  = 10;
		var step    = Math.PI*2/Nverts;
		var radius  = 1.3;
		var i;
		var center=this.map.getCenter();
		for(var i=0;i<Nverts;i++)
		{
			polydata.push([center.lat()+radius*Math.cos(i*step),center.lng()+radius*Math.sin(i*step)]);
		}
		this.getLayer('edit').addPolygon(new this.options.polygonClass({'points':polydata, 'strokecolor': '#ff0000', 'strokeweight': '1', 'strokeopacity': '1', 'fillcolor': '#dd0000', 'fillopacity': '0.5'}));
;
	},
	save:function(){
	},
	
});


// KEEP THIS TOP!
var sBaseHref = document.getElementsByTagName("base")[0].getAttribute("href");
var map_debug=false;

var ContaoMapping;

// handy prototype extension.
Function.prototype.ContaoMappingGmapImplement = function(o){for(i in o)this.prototype[i]=o[i];};

function in_array(item,arr){for(p=0;p<arr.length;p++)if(item==arr[p])return true;return false;}
function arrDelete(arr,v) {for(i=0;i<arr.length;i++)if(arr[i]==v){arr.splice(i,1);return true;}return false;}
function urlencode(s){return escape(s).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');}


(function(){
ContaoMapping = this.ContaoMapping = {
	Classes: {},
};

ContaoMapping.debug = function()
{
	if(console)
		console.log(arguments);
};

ContaoMapping.dynLoad = new (function()
{
	var me=this;
	var libs_ = [];
	var running = false;
	// add lib to stack
	me.addLib = function(lib){
		libs_.push(lib);
		if(!running)
			me.loadNext();
	};
	// load next lib from stack
	me.loadNext = function()
	{
		running = true;
		if(libs_.length==0)
		{
			running = false;
			return;
		}
		var getElem=function()
		{
			var e = document.createElement("script");
			e.type="text/javascript";
			return e;
		};
		var scriptLoaded=function(e)
		{
			if((!e)
			|| (e.srcElement && (src.erase(e.srcElement.src).length==0)) // webkit, Chrome
			|| (e.target && (src.erase(e.target.src).length==0)) // FF - mozilla
			|| (e.src && (src.erase(e.src).length==0)) // IE
			)
			{
				if(callback)
					callback(next);
				me.loadNext();
			}
	};
		var next=libs_.shift();
		var src=next.src;
		var callback = (next.callback)?next.callback:null;
		if(src)
		{
			if(!(src instanceof Array))
				src=[src];
			var loadPending=false;
			src.each(
				function(s)
				{
					if(me.hasLib(s))
					{
						src.erase(s);
					} else {
						var e = getElem();
						loadPending=true;
						if (e.onreadystatechange === undefined)
							// Gecko & Opera
							e.onload=scriptLoaded;
						else
							// IE
							e.onreadystatechange= function(){
								if ((this.readyState == 'loaded') || (this.readyState == 'complete')){
									this.onreadystatechange=null;
									scriptLoaded(e);
							}};
						e.src = s;
						document.getElementsByTagName("head")[0].appendChild(e);
					}
				}
			);
			if(!loadPending)
				scriptLoaded();
		} else {
			var e = getElem();
			/* IE does not allow <script> to have children. :( */
			if (null == e.canHaveChildren || e.canHaveChildren) {
				e.appendChild(document.createTextNode(next.code));
			} else {
				e.text = next.code;
			}
			document.getElementsByTagName("head")[0].appendChild(e);
			scriptLoaded();
		}
	};
	me.hasLib = function(lib)
	{
		var libs=document.getElementsByTagName('script');
			for(var i=0;i<libs.length;i++)
			{
				if(libs[i].src==lib)
					return true;
			}
			return false;
	};
})(); // end dynLoad

/*
 * Enhance mootools to allow "class originating" events. Stolen from mootools Events and modified.
 */
ContaoMapping.Class = function(opts)
{
	if(!Events.removeOn)
	{
		Events.removeOn = function(string)
		{
			return string.replace(/^on([A-Z])/, function(full, first){
				return first.toLowerCase();
			});
		};
	}
	var c=new Class(opts);
	c.prototype.fireClassEvent=(function(type, args, delay){
		c.fireClassEvent(type, args, delay);
	});
	c.prototype.debug=ContaoMapping.debug;
	c.extend({
		$events:{},
		addClassEvent: function(type, fn, internal){
			type = Events.removeOn(type);
			this.$events[type] = (this.$events[type] || []).include(fn);
			if (internal) fn.internal = true;
			return this;
		},
		fireClassEvent: function(type, args, delay){
			if(this.parent && this.parent.fireClassEvent)
				this.parent.fireClassEvent(type, args, delay);
			type = Events.removeOn(type);
			var events = this.$events[type];
			if (!events) return this;
	//		args = Array.from(args);
			events.each(function(fn){
				if (delay) fn.delay(delay, this, args);
				else fn.apply(this, args);
			}, this);
			return this;
		},
		removeClassEvent: function(type, fn){
			type = Events.removeOn(type);
			var events = this.$events[type];
			if (events && !fn.internal){
				var index = events.indexOf(fn);
				if (index != -1) delete events[index];
			}
			return this;
		},
		removeClassEvents: function(events){
			var type;
			if (typeOf(events) == 'object'){
				for (type in events) this.removeEvent(type, events[type]);
				return this;
			}
			if (events) events = Events.removeOn(events);
			for (type in this.$events){
				if (events && events != type) continue;
				var fns = this.$events[type];
				for (var i = fns.length; i--;) if (i in fns){
					this.removeEvent(type, fns[i]);
				}
			}
			return this;
		}
	});
	return c;
};

ContaoMapping.bootMaps = function()
{
	for(var i=0;i<ContaoMapping.Map.instances.length;i++)ContaoMapping.Map.instances[i].boot();
};

})();

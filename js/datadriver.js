(function(){

ContaoMapping.$datadrivers = {};

ContaoMapping.getDataDriver = function(name)
{
	// TODO: automatically load data drivers?
	return ContaoMapping.$datadrivers[name];
};

ContaoMapping.registerDatadriver = function(driver)
{
	ContaoMapping.$datadrivers[driver.prototype.getMime()]=driver;
};


ContaoMapping.DataDriver=new ContaoMapping.Class({
	Implements: [Options, Events],

	runningRequests: [],

	/*
	 * either raw or xml
	 */
	bufferType:'raw',
	/*
	 * Mime type this driver accepts.
	 */
	mimeType: '',

	/*
	 * ContaoMapping.Map instance we are tied to.
	 */
	map: null,

	/*
	 * get the url for the current map location
	 */
	getUrl: function()
	{
		var rect = this.options.map.getExtendedBoundsAsUrl();
		if(!rect)
			return;
		var tmpurl=this.options.url+'&area='+urlencode(rect);
		var params=this.options.additionalparams;
		for(var p in params)
		{
			tmpurl=tmpurl+'&'+p+'='+urlencode(params[p]);
		}
		return tmpurl;
	},

	requestStarted: function(xhr)
	{
		this.runningRequests.push(xhr);
		this.fireEvent('requestStart', [true, this]);
	},

	requestDone: function(xhr)
	{
		this.runningRequests.erase(xhr);
		this.fireEvent('requestDone', [false, this]);
	},

	makeRequest: function(opts)
	{
		var url = this.getUrl();
		if(!url)
			return;
		var that=this, req;
		opts = opts||{};
		var myOpts = {
			url: url,
			onRequest: (function()
			{
				that.requestStarted(req);
			}),
			onComplete: (function()
			{
				that.requestDone(req);
			}),
			onFailure: (function(xhr)
			{
				that.requestDone(req);
				if(opts.errorcallback)
					opts.errorcallback();
			}),
			onSuccess: (function(data, xml)
			{
				var data = that.decodeData(data, xml, req);
				if(opts.callback)
					opts.callback(data);
			})
		};
		opts=Object.merge(myOpts, opts);
		req=new Request(opts);
		if(typeof(REQUEST_TOKEN) != 'undefined')
		{
			req.post(Object.merge({'REQUEST_TOKEN': REQUEST_TOKEN}, opts.data));
		} else {
			req.post(opts.data);
		}
		return req;
	},

	loadMapData:function(opts)
	{
		opts = opts||{};
		var myOpts = {
			'data': {'known': this.options.map.assembleKnownIds()},
			'evalResponse': false
		};
		this.makeRequest(Object.merge(myOpts, opts));
	},

	initialize: function(options)
	{
		//this.setOptions(options);
		// mootools converts the instance to a copy and throws an Exception... :/
		this.options=options;
		this.options.additionalparams=this.options.additionalparams||{};
	},

	decodeData: function(data, xml, req)
	{
		return {};
	},

	getMime:function()
	{
		return this.mimeType?this.mimeType:this.options.mimeType;
	},

	getBufferType:function()
	{
		return this.options.bufferType;
	},

	createObject: function(classtypes, props)
	{
		// find the class that matches the object most closely, this means:
		// start with the lowst class in the hierarchy and walk upwards until we finally reach the parent base class.
		// whenever we have a class, we use it. If no class could be found, we return null.
		for(var k=classtypes.length-1;k>0;k--)
		{
			var map=this.options.map, maptype=map.getImplementationType();
			if(classtypes[k] && ContaoMapping.Classes[classtypes[k]])
			{
				var objclass=ContaoMapping.Classes[classtypes[k]];
				if(objclass)
				{
					return (objclass[maptype])?(new objclass[maptype](map, props)):(new objclass(map, props));
				}
			}
		}
		return null;
	}
});

})();
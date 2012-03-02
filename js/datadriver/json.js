(function(){

ContaoMapping.DataDriver.JSON=new ContaoMapping.Class({
	Extends: ContaoMapping.DataDriver,
	/*
	 * either raw or xml
	 */
	bufferType:'raw',
	/*
	 * Mime type this driver accepts.
	 */
	mimeType: 'application/json',

	initialize: function(options)
	{
		this.parent(options);
		this.options.additionalparams.fmt='json';
	},

	decodeData: function(data, xml, req)
	{
		if(!data)
			return;
		var data = JSON.decode(data), content;

		// Contao 2.10 upwards has request token.
		if(data.token)
		{
			REQUEST_TOKEN = data.token;
			content=data.content;
		} else {
			content=data;
		}

		// pass to map now.
		if(!content)
			return;
		var map=this.options.map;
		// scan for layers
		for (var i=0;i<content.layers.length;i++)
		{
			var props=content.layers[i];
			// layer already in map?
			layer=map.getLayer(props.options.id, true, props.options);
			if(props.objects)
			{
				for(var j=0;j<props.objects.length;j++)
				{
					var obj=props.objects[j];
					if(!layer.has(obj.id))
					{
						var inst=this.createObject(obj.types, obj);
						if(inst)
							layer.add(inst);
					}
				}
			}
		}
	}
});

ContaoMapping.registerDatadriver(ContaoMapping.DataDriver.JSON);

})();

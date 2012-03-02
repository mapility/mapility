<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="<?php echo $this->language; ?>">
<head>
<base href="<?php echo $this->base; ?>"></base>
<title><?php echo $this->title; ?> :: TYPOlight Open Source CMS <?php echo VERSION; ?></title>
<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $this->charset; ?>" />
<link rel="stylesheet" type="text/css" href="system/themes/<?php echo $this->theme; ?>/basic.css" media="screen" />
<link rel="stylesheet" type="text/css" href="system/themes/<?php echo $this->theme; ?>/page.css" media="screen" />
<?php if ($this->isMac): ?>
<link type="text/css" rel="stylesheet" href="system/themes/<?php echo $this->theme; ?>/macfixes.css" media="screen" />
<?php endif; ?>
<!--[if lte IE 7]><link type="text/css" rel="stylesheet" href="../../../system/themes/<?php echo $this->theme; ?>/iefixes.css" media="screen" /><![endif]-->
<!--[if IE 8]><link type="text/css" rel="stylesheet" href="../../../system/themes/<?php echo $this->theme; ?>/ie8fixes.css" media="screen" /><![endif]-->
<style type="text/css" media="screen">
<!--/*--><![CDATA[/*><!--*/
#container{
	width:736px;
}
/*]]>*/-->
</style>
<script type="text/javascript" src="plugins/mootools/mootools-core.js"></script>
<script type="text/javascript" src="plugins/mootools/mootools-more.js"></script>
<script type="text/javascript" src="typolight/typolight.js"></script>
<script type="text/javascript" src="system/themes/<?php echo $this->theme; ?>/hover.js"></script>
<script type="text/javascript" src="<?php echo $this->googlescript; ?>"></script>
<script type="text/javascript" src="system/modules/googlemaps/html/bemap.js"></script>
<script type="text/javascript">
<!--//--><![CDATA[//><!--
document.onLoad = self.focus();

var strAccept = '<?php echo $this->strAccept; ?>';

function loadgooglemap() {
	if (GBrowserIsCompatible()) {
		googlemap = new GMap2(document.getElementById("mapselector"));
		googlemap.enableScrollWheelZoom();
		googlemap.addControl(new GLargeMapControl());
		googlemap.addControl(new GMapTypeControl());
		googlemap.addMapType(G_PHYSICAL_MAP);
		googlemap.setMapType(G_HYBRID_MAP);
		googlemap.setCenter(new GLatLng(<?php echo $this->latitude; ?>, <?php echo $this->longitude; ?>), 1*<?php echo $this->zoom; ?>);
		GEvent.addListener(googlemap, "singlerightclick", getAddress);
		geocoder = new GClientGeocoder();
		geocoder.getLocations(new GLatLng(<?php echo $this->latitude; ?>, <?php echo $this->longitude; ?>), showAddress);
	}
}

window.setTimeout("loadgooglemap()", 500);

function setLocation(p)
{
    self.opener.$(self.opener.Backend.currentId).value = p;
    self.close();
}
//--><!]]>
</script>
</head>
<body>
<div id="container">
<div id="main">
<h1><?php echo $this->headline; ?></h1>
<div id="lookupcontainer">
    <form action="#" onsubmit="showLocation(); return false;">
        <div id="address_search"><input type="text" name="q" value="" class="address_input" size="120" /><input type="submit" name="find" value="<?php echo $this->search; ?>" />

</div>
        <div class="block" id="mapselector" style="width:700px;height:400px;display:block; margin:auto;">&nbsp;</div>
	</form>
</div>
</div>
</div>
</body>
</html>
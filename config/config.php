<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */

// widgets

$GLOBALS['BE_FFL']['geolookup'] = 'GeoLookup';
$GLOBALS['TL_FFL']['geolookup'] = 'GeoLookup';
$GLOBALS['BE_FFL']['polygon'] = 'GeoPolygon';
$GLOBALS['BE_FFL']['polyline'] = 'GeoPolyline';

array_insert($GLOBALS['FE_MOD']['miscellaneous'], 9, array
	(
		'contaomaps' => 'ModuleContaoMaps'
	)
);

$GLOBALS['BE_MOD']['content']['contaomaps'] = array
	(
		'tables'			=> array('tl_contaomap', 'tl_contaomap_layer', 'tl_contaomap_marker', 'tl_contaomap_polygon', 'tl_contaomap_polyline'),
		'icon'				=> 'system/modules/contaomaps/html/icon.gif',
	);

if (TL_MODE == 'BE')
{
	$GLOBALS['TL_CSS'][] = 'system/modules/contaomaps/html/map.css';
}


$GLOBALS['CONTAOMAP_MAPDRIVERS']['default'] = 'ContaoMap';

$GLOBALS['CONTAOMAP_MAPLAYERS']['internal'] = 'ContaoMapLayerInternal';

//$GLOBALS['CONTAOMAP_MAPOBJECTS']['code'] = 'ContaoMapObjectCode';
$GLOBALS['CONTAOMAP_MAPOBJECTS']['marker'] = 'ContaoMapObjectMarker';
$GLOBALS['CONTAOMAP_MAPOBJECTS']['polygon'] = 'ContaoMapObjectPolygon';
$GLOBALS['CONTAOMAP_MAPOBJECTS']['polyline'] = 'ContaoMapObjectPolyline';

//$GLOBALS['CONTAOMAP_ENCODER']['xml'] = 'ContaoMapEncoderXML';
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMap'] = 'ContaoMapEncoderJSON';
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapLayer'] = array('ContaoMapEncoderJSONLayer');
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapObject'] = array('ContaoMapEncoderJSONObject');
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapObjectCode'] = array('ContaoMapEncoderJSONCode');
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapObjectMarker'] = array('ContaoMapEncoderJSONMarker');
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapObjectPolygon'] = array('ContaoMapEncoderJSONPolygon');
$GLOBALS['CONTAOMAP_ENCODER']['json']['ContaoMapObjectPolyline'] = array('ContaoMapEncoderJSONPolyline');


// All javascript libraries, these will get combined and compiled to a common file.

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/base.js'] = array();

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/datadriver.js'] = array(
	'system/modules/contaomaps/js/base.js'
);

//$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/datadriver/xml.js'] = array('system/modules/contaomaps/js/datadriver.js');

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/datadriver/json.js'] = array(
	'system/modules/contaomaps/js/datadriver.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/map.js'] = array(
	'system/modules/contaomaps/js/base.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/mapobject.js'] = array(
	'system/modules/contaomaps/js/base.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/mapobjectcode.js'] = array(
	'system/modules/contaomaps/js/mapobject.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/marker.js'] = array(
	'system/modules/contaomaps/js/mapobject.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/polyline.js'] = array(
	'system/modules/contaomaps/js/mapobject.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/polygon.js'] = array(
	'system/modules/contaomaps/js/mapobject.js'
);

$GLOBALS['CONTAOMAP_JSLIBS']['system/modules/contaomaps/js/layer.js'] = array(
	'system/modules/contaomaps/js/base.js',
	'system/modules/contaomaps/js/marker.js'
);

?>
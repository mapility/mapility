<?php

/**
 * Contao Open Source CMS
 *
 * Copyright (c) 2005-2014 Leo Feyer
 *
 * @package Contaomaps
 * @link    https://contao.org
 * @license http://www.gnu.org/licenses/lgpl-3.0.html LGPL
 */


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	'ContaoMapObjectMarker'        => 'system/modules/contaomaps/ContaoMapObjectMarker.php',
	'ModuleContaoMaps'             => 'system/modules/contaomaps/ModuleContaoMaps.php',
	'ContaoMapEncoderObjectWalker' => 'system/modules/contaomaps/ContaoMapEncoderObjectWalker.php',
	'ContaoMapObjectCode'          => 'system/modules/contaomaps/ContaoMapObjectCode.php',
	'ContaoMapEncoderJSONPolygon'  => 'system/modules/contaomaps/ContaoMapEncoderJSONPolygon.php',
	'GeoLookup'                    => 'system/modules/contaomaps/GeoLookup.php',
	'ContaoMap'                    => 'system/modules/contaomaps/ContaoMap.php',
	'ContaoMapEncoderJSONLayer'    => 'system/modules/contaomaps/ContaoMapEncoderJSONLayer.php',
	'GeoPolyline'                  => 'system/modules/contaomaps/GeoPolyline.php',
	'ContaoMapEncoderXML'          => 'system/modules/contaomaps/ContaoMapEncoderXML.php',
	'ContaoMapObjectPolyline'      => 'system/modules/contaomaps/ContaoMapObjectPolyline.php',
	'ContaoMapDatabase'            => 'system/modules/contaomaps/ContaoMapDatabase.php',
	'ContaoMapEncoderJSONObject'   => 'system/modules/contaomaps/ContaoMapEncoderJSONObject.php',
	'ContaoMapEncoderJSONCode'     => 'system/modules/contaomaps/ContaoMapEncoderJSONCode.php',
	'ContaoMapObject'              => 'system/modules/contaomaps/ContaoMapObject.php',
	'ContaoMapEncoderJSONPolyline' => 'system/modules/contaomaps/ContaoMapEncoderJSONPolyline.php',
	'ContaoMapEncoderJSONMarker'   => 'system/modules/contaomaps/ContaoMapEncoderJSONMarker.php',
	'ContaoMapObjectPolygon'       => 'system/modules/contaomaps/ContaoMapObjectPolygon.php',
	'ContaoMapLayerInternal'       => 'system/modules/contaomaps/ContaoMapLayerInternal.php',
	'ContaoMapEncoder'             => 'system/modules/contaomaps/ContaoMapEncoder.php',
	'ContaoMapEncoderJSON'         => 'system/modules/contaomaps/ContaoMapEncoderJSON.php',
	'GeoPolygon'                   => 'system/modules/contaomaps/GeoPolygon.php',
	'ContaoMapLayer'               => 'system/modules/contaomaps/ContaoMapLayer.php',
));


/**
 * Register the templates
 */
TemplateLoader::addFiles(array
(
	'mod_contaomaps' => 'system/modules/contaomaps/templates',
	'contaomap'      => 'system/modules/contaomaps/templates',
	'be_geopicker'   => 'system/modules/contaomaps/templates',
));

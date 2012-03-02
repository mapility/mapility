<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps 
 * @license    LGPL 
 * @filesource
 */

class ContaoMapDatabase extends System
{
	public static function DB()
	{
		return Database::getInstance();
	}

	protected static function getMapFromDB($id)
	{
		return self::DB()->prepare('SELECT * FROM tl_contaomap WHERE id=?')->limit(1)->execute($id);
	}

	public static function getMap($id)
	{
		$objRowMap = self::getMapFromDB($id);
		// TODO: remove google fallback when done.
		$mapType = $objRowMap->type?$objRowMap->type:'google';
		$objMap= new $GLOBALS['CONTAOMAP_MAPDRIVERS'][$mapType]($objRowMap->row());
		$objMap->name='contaomap_'.$objRowMap->id;

		// translate all properties now.
		$objMap->center=$objRowMap->coords;

		return $objMap;
	}

	public static function getLayersForMapFromDB($id)
	{
		return deserialize(self::DB()->prepare('SELECT * FROM tl_contaomap WHERE id=?')->limit(1)->execute($id)->layer);
	}

	public static function collectLayers($objMap, $arrLayers, $knownIds=array())
	{
		if(count($arrLayers))
		{
			if(!$knownIds)
				$knownIds=$objMap->knownIds;
			$objLayer=self::DB()->prepare('SELECT * FROM tl_contaomap_layer WHERE id IN ('.implode(',',$arrLayers).')')->execute();
			while($objLayer->next())
			{
				$arrLayer = $objLayer->row();
				$arrLayer['jsid'] = $objLayer->alias?$objLayer->alias:$objLayer->type.'.'.$objLayer->id;
				$strClass=$GLOBALS['CONTAOMAP_MAPLAYERS'][$objLayer->type];
				if(!$strClass)
					throw new Exception('No class defined for map layer type '.$objLayer->type);
				$objCollector = new $strClass($arrLayer);
				$objMap->addLayer($objCollector);
				$objCollector->setModule($objMap);
				$objCollector->assembleObjects((array)$knownIds[$objCollector->jsid]);
			}
		}
	}
}

?>
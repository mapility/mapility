<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */


class ContaoMapEncoderJSONPolygon
{
	public static function encode(ContaoMapObjectPolygon $object, $res, $global)
	{
		foreach(array('strokecolor', 'strokeweight', 'strokeopacity', 'fillcolor', 'fillopacity', 'points') as $k)
			if($object->$k)
				$res[$k] = $object->$k;
		return $res;
	}
}

?>

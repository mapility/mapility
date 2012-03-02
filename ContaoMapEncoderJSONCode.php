<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */


class ContaoMapEncoderJSONCode
{
	public static function encode(ContaoMapObjectCode $object, $res, $global)
	{
		foreach(array('code') as $k)
			if($object->$k)
				$res[$k] = $object->$k;
		return $res;
	}
}

?>

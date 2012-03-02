<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */

class ContaoMapEncoderJSONObject
{
	public static function encode(ContaoMapObject $object, $res, $global)
	{
		if(!array_key_exists('types', $res))
			$res['types'] = array();
		if($object->jsid)
			$res['id'] = $object->jsid;
		$strClass=get_class($object);
		while($strClass)
		{
			array_unshift($res['types'], $strClass);
			$strClass = get_parent_class($strClass);
		}
		return $res;
	}
}

?>

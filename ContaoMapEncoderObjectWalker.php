<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */

	/**
	 * @class ContaoMapEncoderObjectWalker
	 * If you are not writing an encoder, you will not need to care about this class.
	 * Iterates through all parent classes and calls the corresponding encoder class on the object.
	 * Iteration is top down, so the top parent will get encoded first (most likely this will be ContaoMapObject).
*/
class ContaoMapEncoderObjectWalker extends System
{
	/**
	 * Iterates through all parent classes and calls the corresponding encoder class on the object.
	 * Iteration is top down, so the top parent will get encoded first (most likely this will be ContaoMapObject).
	 * @param object $object the object that shall be encoded.
	 * @param string $encodingType the encoding type that shall be applied. See the keys of $GLOBALS['CONTAOMAP_ENCODER'] for what encodings are available.
	 * @param mixed $res (optional) the current result that shall be passed to the encoding classes. This is usually an empty initialized result value.
	 * @param mixed $global (optional) using this variable you can tell the encoding handler about the environment the current object will get encoded in.
	 */
	public static function encode($object, $encodingType, $res=NULL, $global=NULL)
	{
		$arrClasses=array();
		$strClass=get_class($object);
		while($strClass)
		{
			array_unshift($arrClasses, $strClass);
			$strClass=get_parent_class($strClass);
		}

		foreach($arrClasses as $strClass)
		{
			$arrEncoder=$GLOBALS['CONTAOMAP_ENCODER'][$encodingType][$strClass];
			if($arrEncoder)
			{
				foreach($arrEncoder as $strEncoder)
				{
					$res = call_user_func_array(array($strEncoder, 'encode'), array($object, $res, $global));
				}
			}
		}
		return $res;
	}
}

?>
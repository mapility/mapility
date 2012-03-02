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
 * class ContaoMapObjectCode
 * implementation of a simple object of javascript, that will get executed on the client side.
 */
class ContaoMapObjectCode extends ContaoMapObject
{
	/**
	 * Initialize the object with given parameters.
	 * @param mixed $arrData optional base information for this script. MUST be either array (ja code in field "code") or string
	 */
	function __construct($arrData=array())
	{
		if(is_string($arrData))
			$arrData=array('code' => $arrData);
		parent::__construct();
	}
}

?>
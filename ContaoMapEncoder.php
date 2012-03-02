<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */



class ContaoMapEncoder extends System
{
	public function encode(ContaoMap $map)
	{
		return '';
	}

	public static function getMime()
	{
		return 'application/octet-stream';
	}
}

?>
<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */


class ContaoMapEncoderJSONLayer
{
	public static function encode(ContaoMapLayer $layer, $res, $global)
	{
		$res['options']['mgrtype'] = $layer->mgrtype;
		$res['options']['name'] = $layer->name;
		$res['options']['id'] = $layer->jsid;
		if($layer->mgrtype=='markerclusterer' && $layer->clustermgr)
		{
			$res['markerclusterer']=$layer->clustermgr;
		}
		// encode objects
		if(count($layer->objects))
		{
			foreach($layer->objects as $obj)
			{
				$res['objects'][] = ContaoMapEncoderObjectWalker::encode($obj, 'json', array(), $res);
			}
		}
		return $res;
	}
}

?>

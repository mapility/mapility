<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */


class ContaoMapEncoderJSON extends ContaoMapEncoder
{
	public function encode(ContaoMap $map)
	{
		$arrJSON=array();
		$layers=$map->layer;
		if(count($layers))
		{
			foreach($layers as $k=>$layer)
			{
				$tmp = ContaoMapEncoderObjectWalker::encode($layer, 'json', array(), $arrJSON);
				if($tmp)
					$arrJSON[]=$tmp;
			}
		}
		$result = array('layers'=>$arrJSON);
		return (version_compare(VERSION, '2.9', '>'))?$result:json_encode($result);
	}

	public static function getMime()
	{
		return 'application/json';
	}
}
?>
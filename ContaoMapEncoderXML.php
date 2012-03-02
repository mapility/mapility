<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */

class ContaoMapEncoderXML extends ContaoMapEncoder
{
	protected $objXML=null;


	public function vaporizeIfEmpty(SimpleXMLElement $xml, SimpleXMLElement &$node)
	{
		if(!(count($node->children()) || count($node->attributes()->children())))
		{
			var_dump($node->getName(), count($node->children()), count($node->attributes()->children()));
			$name=$node->getName();
			$nodes=$xml->$name;
			foreach($xml->$name as $v)
			{
				if($v==$node)
				{
					$dom=dom_import_simplexml($node);
					$dom->parentNode->removeChild($dom);
					break;
				}
			}
			return;
		}
	}

	protected $encodeStack = array();

	public function encodeVar(&$var, SimpleXMLElement $xml, $whiteList=array(), $blacklist=array())
	{
		// recursion protection.
		if(in_array($var, $this->encodeStack, true))
		{
			return;
		}
		array_push($this->encodeStack, $var);
		foreach($var as $k=>$v)
		{
			if((!$v) || in_array($k, $blacklist))
				continue;
			if($whiteList && !in_array($k, $whiteList))
				continue;
			$v=deserialize($v);
			$useElem=is_array($v)||is_object($v);
			if($useElem)
			{
				$sub=$xml->addChild($k);
				$this->encodeVar($v, $sub, $whiteList, $blacklist);
				$this->vaporizeIfEmpty($xml, $sub);
			} else if(!is_numeric($k)) {
				$xml->addAttribute($k, (string)$v);
			} else {
				$xml->{$xml->getName()}=$v;
				
			}
			
		}
		array_pop($this->encodeStack);
	}

	protected function encodePolyPoints($points, SimpleXMLElement $xml)
	{

		foreach($points as $point)
		{
			$p=$xml->addChild('point');
			foreach(array(0=>'lat', 1=>'lon', 2=>'alt') as $k=>$v)
			{
				if($point[$k])
					$p->addAttribute($v, $point[$k]);
			}
		}
	}

	protected static function encodePolygon($polygon)
	{
		$this->encodeVar($polygon, $xml, array('id', 'strokecolor', 'strokeweight', 'strokeopacity', 'fillcolor', 'fillopacity'));
		if($polygon['points'])
			$this->encodePolyPoints($polygon['points'], $xml->addChild('points'));
	}

	protected function encodePolyline($polyline, SimpleXMLElement $xml)
	{
		$this->encodeVar($polyline, $xml, array('id', 'strokecolor', 'strokeweight', 'strokeopacity'));
		if($polyline['points'])
			$this->encodePolyPoints($polyline['points'], $xml->addChild('points'));
	}

	/*
		Encode a marker
	*/
	protected function encodeMarker($point, SimpleXMLElement $xml)
	{
		$this->encodeVar($point, $xml, array(), array('longitude', 'latitude', 'altitude', 'icon', 'iconposition', 'iconsize', 'infoposition', 'shadowsize', 'infotext'));
		foreach(array('longitude', 'latitude', 'altitude', 'icon', 'iconposition', 'iconsize', 'infoposition', 'shadowsize') as $k)
		{
			if($point[$k])
				$xml->addAttribute($k, $point[$k]);
		}
		if($point['infotext'])
			$xml->infotext=$point['infotext'];
	}

	public function encodeLayer($layer, SimpleXMLElement $xml)
	{
		if($layer['id'])
		{
			$this->encodeVar($layer, $xml, array('mgrtype', 'name', 'id'));
			if($layer['mgrtype']=='markerclusterer')
			{
				$xml->markerclusterer=$layer['clustermgr'];
			}
			// encode markers
			if(count($layer['points']))
			{
				$markers=$xml->addChild('markers');
				foreach($layer['points'] as $v)
				{
					$this->encodeMarker($v, $markers->addChild('marker'));
				}
			}
			// encode polylines
			if(count($layer['polylines']))
			{
				$polylines=$xml->addChild('polylines');
				foreach($layer['polylines'] as $v)
				{
					$this->encodePolyLine($v, $polylines->addChild('polyline'));
				}
			}

			// encode polygons
			if(count($layer['polygons']))
			{
				$polylines=$xml->addChild('polygons');
				foreach($layer['polygons'] as $v)
				{
					$this->encodePolyGon($v, $polygons->addChild('polygon'));
				}
			}
		}
	}

	public function encodeMap(ContaoMap $map)
	{
		$this->objXML=new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><contaomap/>');
		$layers=$map->layer;
		if(count($layers))
		{
			$xmlLayers=$this->objXML->addChild('layers');
			foreach($layers as $k=>$layer)
			{
				$xmlLayer=$xmlLayers->addChild('layer');
				$this->encodeLayer($layer, $xmlLayer);
			}
		}
		$result = $this->objXML->asXML();
		return $result;
	}

	public static function getMime()
	{
		return 'text/xml';
	}
}
?>
<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL
 * @filesource
 */

abstract class ContaoMap extends System
{
	protected $layerIds = NULL;
	protected $arrLayer = array();
	protected $objDefaultMapper = NULL;
	protected $arrOther = array();
	protected $knownIds = array();

	protected $driver=NULL;

	protected $viewPort = array(array(0, 0), array(0, 0));

	/**
	 * Initialize the object with given parameters.
	 * @param array $arrData optional base information for this layer.
	 */
	public function __construct($arrData=array())
	{
		parent::__construct();
		$this->import('Database');

		// initialize everything to sane values.
		$this->name = uniqid('contaomap_');
		$this->center=array(0,0);
		$this->width = 640;
		$this->height = 480;
		$this->alttext = '';
		$this->encoder=$this->Input->get('fmt');
		$this->template='mod_contaomaps';

		if($this->Input->get('area'))
			$this->setArea($this->Input->get('area'));

		// check if we have some ids we want to omit.
		if($this->Input->post('known') && $this->Input->post('known')!='{}')
		{
			$knownIds=$this->Input->post('known');
			if(!is_array($knownIds))
				$knownIds=@json_decode($knownIds);
			$realIds=array();
			// we definately want to check that these ids make sense and do not contain arbitrary data.
			foreach($knownIds as $layer=>$ids)
			{
				$layerIds=array();
				if(is_array($ids))
				{
					foreach($ids as $id)
					{
						if(strpos($id, '_'))
						{
							list($objtype, $id) = explode('_', $id);
							$layerIds[$objtype][] = $id;
						} else
							$layerIds[] = $id;
					}
				}
				if(count($layerIds))
					$realIds[$layer]=$layerIds;
			}
		}
		$this->knownIds=$realIds;

		$this->setKeys($arrData, array('name', 'center', 'width', 'height', 'alttext', 'encoder', 'ajaxUrl', 'template', 'northEast', 'southWest', 'loadinganimation'));
	}

	public function setKeys($arrData, $arrKeys)
	{
		foreach($arrKeys as $key)
		{
			if(isset($arrData[$key]))
				$this->$key=deserialize($arrData[$key]);
		}
	}

	public function __set($key, $value)
	{
		switch($key)
		{
			case 'center':
				if(is_string($value))
					$value=explode(',', $value);
				if(is_string($value))
					$value=explode(' ', $value);
				$this->arrOther[$key] = array(floatval($value[0]), floatval($value[1]));
			break;
			case 'name':
			case 'width':
			case 'height':
			case 'alttext':
			case 'encoder':
			case 'ajaxUrl':
			case 'template':
			case 'loadinganimation':
				$this->arrOther[$key] = deserialize($value);
			break;
			case 'northEast':
				$this->viewPort[0] = $value;
			break;
			case 'southWest':
				$this->viewPort[1] = $value;
			break;
			default:
				throw new Exception('Can not set property '.$key);
		}
	}

	public function __get($key)
	{
		switch($key)
		{
			case 'name':
			case 'center':
			case 'width':
			case 'height':
			case 'alttext':
			case 'encoder':
			case 'ajaxUrl':
			case 'loadinganimation':
				return array_key_exists($key, $this->arrOther) ? $this->arrOther[$key] : NULL;
			case 'northEast':
				return $this->viewPort[0];
			break;
			case 'southWest':
				return $this->viewPort[1];
			break;

			case 'knownIds':
				return $this->knownIds;
			break;
			case 'layer':
				return $this->arrLayer;
			default:
				throw new Exception('Unknown property '.$key);
			break;
		}
	}

	public function writeOptionsToTemplate(Template $objTemplate)
	{
		foreach(array('name', 'center', 'width', 'height', 'alttext', 'encoder', 'ajaxUrl', 'northEast', 'southWest') as $key)
			$objTemplate->$key=$this->$key;
	}

	abstract public function jsonMapOptions();

	public function setArea($area)
	{
		if(!is_array($area))
			$area=explode(',', $area);
		$this->northEast=array($area[0], $area[1]);
		$this->southWest=array($area[2], $area[3]);
	}

	public function addLayer(ContaoMapLayer $value)
	{
		if(!$value->id)
			$value->id=uniqid('dynlayer_');
		$this->arrLayer[$value->id] = $value;
	}

	public function getAreaFilter($latField, $longField)
	{
		if($this->northEast && $this->southWest)
		{
			return '(('.$latField.'>='.$this->northEast[0].' AND '.$longField.'>='.$this->northEast[1].')
			AND ('.$latField.'<='.$this->southWest[0].' AND '.$longField.'<='.$this->southWest[1].'))';
		}
		return '';
	}

	public function getAreaIntersectFilter($latFieldMin, $latFieldMax, $longFieldMin, $longFieldMax)
	{
		if($this->northEast && $this->southWest)
		{
			return '('.$latFieldMin.'>='.$this->northEast[0].
			' OR '.$longFieldMin.'>='.$this->northEast[1].
			' OR '.$latFieldMax.'<='.$this->southWest[0].
			' OR '.$longFieldMax.'<='.$this->southWest[1].')';
		}
		return '';
	}

	/*
	 * Calculates the extend of an array of points and returns the minimum and maximum latitude and longitude
	 * @param array/string $points
	 * @returns array (array min, array max)
	 */
	public static function calcExtends($points)
	{
		if(is_string($points))
		{
			$points = explode("\n", $points);
		}
		if(is_array($points))
		{
			$min = array(90, 180);
			$max = array(0, 0);
			foreach($points as $point)
			{
				if(!is_array($point))
				{
					$point = explode(',', $point);
				}
				$lat = floatval($point[0]);
				$lng = floatval($point[1]);
				if($lat<$min[0])
					$min[0]=$lat;
				if($lng<$min[1])
					$min[1]=$lng;
				if($lat>$max[0])
					$max[0]=$lat;
				if($lng>$max[1])
					$max[1]=$lng;
			}
			return array($min, $max);
		}
		trigger_error('invalid argument passed to ContaoMap::calcExtends()', E_USER_ERROR);
	}

	/**
	 * Determine locations via Google Geocoding API http://code.google.com/intl/en/apis/maps/documentation/geocoding/
	 * @param string $query a valid query according to: http://code.google.com/intl/en/apis/maps/documentation/geocoding/#GeocodingRequests
	 * @return array the resulting array as described in http://code.google.com/intl/en/apis/maps/documentation/geocoding/#GeocodingResponses
	 */
	public static function getLocations($query)
	{
		$req = new RequestExtended();
		return $req->getUrlEncoded('http://maps.googleapis.com/maps/api/geocode/json?'.urlencode($query)) ? json_decode($req->response, true) : NULL;
	}

	/**
	 * Returns the longitude and latitude from the first match from a ContaoMap::getLocations request.
	 * @param string $query a valid query according to: http://code.google.com/intl/en/apis/maps/documentation/geocoding/#GeocodingRequests
	 * @return array the resulting array like this array('lon' => 0.0000, 'lat' => 0.0000)
	 */
	public static function getFirstLocationsGeo($query)
	{
		$location_array = self::getLocations($query);
		if(is_array($location_array) && count($location_array) > 0 && $location_array['status']=='OK')
		{
			return $location_array['results'][0]['geometry']['location'];
		}
		return false;
	}

	public function compileCustomIcons()
	{
		if(!($this->encoder && $GLOBALS['CONTAOMAP_ENCODER'][$this->encoder]))
			$this->encoder='json';
		$classEncoder=new $GLOBALS['CONTAOMAP_ENCODER'][$this->encoder]['ContaoMap']();
		header('Content-type: '.$classEncoder->getMime());
		return $classEncoder->encode($this);
	}

	protected function compileJavaScript()
	{
		return '<script type="text/javascript">/*<![CDATA[*/var '.$this->name.'=null;
	window.addEvent("domready", function(){'.$this->name.'=(new ContaoMapping.Map'.($this->driver?'.'.$this->driver:'').'($("'.$this->name.'"), '.$this->jsonMapOptions().'));});'.
	((version_compare(VERSION, '2.9', '>') && (!$GLOBALS['TL_CONFIG']['disableRefererCheck'])) ? 'var REQUEST_TOKEN="'.REQUEST_TOKEN.'";' : '').'
	/*]]>*/</script>';
	}

	protected function sortDependencies(&$libraries, &$source)
	{
		foreach($source as $libfile=>$dependencies)
		{
			// remove all libs from dependencies that have already been added.
			foreach ($dependencies as $key => $value)
			{
				if(in_array($value, $libraries))
				{
					unset($source[$libfile][$key]);
				} else if(!array_key_exists($value, $source))
				{
					throw new Exception(sprintf('Javascript dependency %s not registered. Required by %s', $value, $libfile));
				}
			}
			// now add this library if it has no more dependencies
			if(count($dependencies)==0)
			{
				$libraries[]=$libfile;
				unset($source[$libfile]);
			}
		}
		return count($source)==0;
	}

	protected function buildLibrary()
	{
		// TODO: implement an combiner that uses the libs from base and the certain driver.
		$libraries = $GLOBALS['CONTAOMAP_JSLIBS'];
		$stack=array();
		$count=0;
		while(!$this->sortDependencies($stack, $libraries) && $count<200)
		{
			$count++;
		}

		$objLibs=new Combiner();
		foreach($stack as $lib)
		{
			if(!file_exists($lib))
				throw new Exception(sprintf('Javascript library %s not found', $lib));
			$objLibs->add($lib);
		}
			$objLibs->add('system/modules/contaomaps/js/boot.js');

		// TODO: remove when done with debugging.
		$filename=str_replace(TL_SCRIPT_URL, '', $objLibs->getCombinedFile());
		Files::getInstance()->delete($filename);
		return $objLibs->getCombinedFile();
	}

	public function getHeadTags()
	{
		return array
		(
			'css' => array('system/modules/contaomaps/html/map.css'),
			'js' => array($this->buildLibrary())
		);
	}
}

?>
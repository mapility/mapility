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
 * Class ContaoMapLayer
 *
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    Controller
 */

class ContaoMapLayer extends System
{
	protected $map = NULL;
	protected $arrData = array();
	protected $arrObjects = array();

	/**
	 * Initialize the object with given parameters.
	 * @param array $arrData optional base information for this layer.
	 */
	function __construct($arrData=array())
	{
		parent::__construct();
		$this->import('Database');
		foreach($arrData as $k=>$v)
			$this->__set($k, $v);
	}

	public function __set($key, $value)
	{
		if($value!==NULL)
		{
			$this->arrData[$key]=$value;
		} else {
			unset($this->arrData[$key]);
		}
	}

	public function __get($key)
	{
		switch ($key)
		{
			case 'objects':
				return $this->arrObjects;
				break;
			
			default:
				return array_key_exists($key, $this->arrData)?$this->arrData[$key]:NULL;
				break;
		}
	}

	public function getProperties()
	{
		return array_keys($this->arrData);
	}

	public function setModule(&$value)
	{
		// fetch required info over.
		$this->map = $value;
	}

	public function mapValue($key)
	{
		return $this->map->$key;
	}

	public function setMapValue($key, $value)
	{
		$this->map->$key = $value;
	}

	/**
	 * Add an object to this layer.
	 * @param ContaoMapObject $obj the object to be added
	 */
	protected function add(ContaoMapObject $obj)
	{
		$this->arrObjects[] = $obj;
	}

	/**
	 * Adds a code object to this layer.
	 * @param string $code the javascript code to be run on the client side.
	 */
	protected function addCode($code)
	{
		$this->add(new ContaoMapObjectCode($code));
	}

	/**
	 * Adds a debug print on the client side.
	 * @param mixed $value the message that shall get emitted in the log on the clientside.
	 */
	protected function addLogMessage($value)
	{
		$this->addCode('ContaoMapping.debug("'.str_replace(array("\n", "\t"), '', var_export($value, true)).'");');
	}

	/**
	 * returns the code to make the map move to the given location.
	 * NOTE: this will NOT add the code to the reply. To do so, you will have to call @link(ContaoMapLayer::addCode)
	 * @param string $latitude the latitude for the location
	 * @param string $longitude the longitude for the location
	 * 	 */
	protected function getScriptMoveTo($latitude, $longitude)
	{
		return 'this.setCenter(['.$latitude.', '.$longitude.']);';
	}

	/**
	 * Determines the current area filter from the current map.
	 * @param string $latField the name of the field containing the latitude.
	 * @param string $longField the name of the field containing the longitude.
	 * @return string the valid SQL filter for the given fields.
	 */
	public function getAreaFilter($latField, $longField)
	{
		return $this->map->getAreaFilter($latField, $longField);
	}

	public function getAreaIntersectFilter($latFieldMin, $latFieldMax, $longFieldMin, $longFieldMax)
	{
		return $this->map->getAreaIntersectFilter($latFieldMin, $latFieldMax, $longFieldMin, $longFieldMax);
	}


	/**
	 * Determine locations via Google Geocoding API http://code.google.com/intl/en/apis/maps/documentation/geocoding/
	 * @param string $query a valid query according to: http://code.google.com/intl/en/apis/maps/documentation/geocoding/#GeocodingRequests
	 * @return array the resulting array as described in http://code.google.com/intl/en/apis/maps/documentation/geocoding/#GeocodingResponses
	 */
	public function getLocations($query)
	{
		return $this->map->getLocations($query);
	}

	public function getFirstLocationsGeo($query)
	{
		return $this->map->getFirstLocationsGeo($query);
	}

	/**
	 * This makes the layer generate all objects valid to the current request.
	 * @param array $omitObjects this array holds all objects already known to the map and that therefore shall not be returned.
	 * @return void
	 */
		public function assembleObjects($omitObjects)
	{
		return false;
	}

}

?>
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
 * class ContaoMapObject
 */
class ContaoMapObject
{
	/**
	 * All properties stored in this object
	 */
	// TODO: make this protected when finished refactoring
	public $arrData=array();

	/**
	 * Initialize the object with given parameters.
	 * @param array $arrData optional base information for this object. The nature of the values is known to the descendant class.
	 */
	function __construct($arrData=array())
	{
		// ensure we have an id, even if it is not predictable afterwards.
		$this->arrData['jsid']=uniqid('dynobj_');
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
		return isset($this->arrData[$key])?$this->arrData[$key]:NULL;
	}

	public function getProperties()
	{
		return array_keys($this->arrData);
	}
}

?>
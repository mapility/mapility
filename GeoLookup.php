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
 * Class GeoLookup
 *
 * Provide methods to handle geolocation fields.
 * @copyright  Cyberspectrum 2011
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    Controller
 */
class GeoLookup extends Widget
{

	/**
	 * Submit user input
	 * @var boolean
	 */
	protected $blnSubmitInput = true;

	/**
	 * Template
	 * @var string
	 */
	protected $strTemplate = 'be_widget';

	/**
	 * Contents
	 * @var array
	 */
	protected $arrContents = array();

	/**
	 * Initialize the object
	 * @param array
	 */
	public function __construct($arrAttributes=false)
	{
		parent::__construct($arrAttributes);
		if(TL_MODE=='FE')
			$this->strTemplate = 'form_widget';
	}


	/**
	 * Add specific attributes
	 * @param string
	 * @param mixed
	 */
	public function __set($strKey, $varValue)
	{
		switch ($strKey)
		{
			case 'value':
				$this->varValue = deserialize($varValue);
				break;
			case 'mandatory':
				$this->arrConfiguration['mandatory'] = $varValue ? true : false;
				break;
			case 'readonly':
				$this->arrAttributes['readonly'] = 'readonly';
				$this->blnSubmitInput = false;
				break;
			default:
				parent::__set($strKey, $varValue);
				break;
		}
	}


	/**
	 * Trim values
	 * @param mixed
	 * @return mixed
	 */
	protected function validator($varInput)
	{
		if (is_array($varInput))
		{
			return parent::validator($varInput);
		}
		return parent::validator(trim($varInput));
	}


	/**
	 * Generate the widget and return it as string
	 * @return string
	 */
	public function generate()
	{
		$arrOptions = array();
		foreach(array('remote_street', 'remote_city', 'remote_region', 'remote_country') as $fname)
		{
			if($this->$fname)
			{
				$arrOptions[$fname]='ctrl_'.$this->$fname;
			}
		}

		// Backend.pickGeoLocation(this, 'ctrl_coords', '1', 'cat_gmaps')
		if(!$this->strWizard)
			$this->strWizard = ' ' . $this->generateImage('system/modules/contaomaps/html/icon.gif', $GLOBALS['TL_LANG']['MSC']['geopicker'], 'style="vertical-align:top; cursor:pointer;" onclick="ContaoMaps.pickGeoLocation(this, \'ctrl_' . $this->strId . '\', '.str_replace('"', '\'', json_encode($arrOptions)).')" title="'.$GLOBALS['TL_LANG']['MSC']['geopicker'].'"');
		// fetch the base data for contao maps.
		$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/contaomaps/html/bemap.js';
		return sprintf('<input type="text" name="%s" id="ctrl_%s" class="'.(TL_MODE=='BE'?'tl_':'').'text%s" value="%s"%s'.(TL_MODE=='BE'?
' onfocus="Backend.getScrollOffset();"':'').' />%s',
						$this->strName,
						$this->strId,
						(strlen($this->strClass) ? ' ' . $this->strClass : ''),
						specialchars($this->varValue),
						$this->getAttributes(),
						$this->wizard);
	}
}

?>
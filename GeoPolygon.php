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
 * Class GeoPolygon
 *
 * Provide methods to handle polygon fields.
 * @copyright  Cyberspectrum 2009
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    Controller
 */
class GeoPolygon extends TextArea
{
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
	 * Generate the label and return it as string
	 * @return string
	 */
	public function generateLabel()
	{
		return parent::generateLabel() . $this->generateImage('system/modules/contaomaps/html/icon.gif', $GLOBALS['TL_LANG']['MSC']['geopicker'], 'style="vertical-align:top; cursor:pointer;" onclick="ContaoMaps.generatePolygon(this, \'ctrl_' . $this->strId . '\', \'\', \'\')"');
	}

	/**
	 * Generate the widget and return it as string
	 * @return string
	 */
	public function generate()
	{
		// fetch the base data for contao maps.
		$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/contaomaps/html/bemap.js';
		$strBuffer = sprintf('<textarea name="%s" id="ctrl_%s" class="%s" rows="%s" cols="%s"%s%s" style="height:500px;">%s</textarea>%s',
						$this->strName,
						$this->strId,
						(TL_MODE == 'BE'?'tl_':'').'textarea'. (strlen($this->strClass) ? ' ' . $this->strClass : ''),
						$this->intRows,
						$this->intCols,
						$this->getAttributes(),
						(TL_MODE == 'BE'?' onfocus="Backend.getScrollOffset();':''),
						specialchars($this->varValue),
						$this->wizard);
		return $strBuffer;
	}
}

?>
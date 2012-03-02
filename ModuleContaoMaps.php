<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2009
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps 
 * @license    LGPL 
 * @filesource
 */


/**
 * Class ModuleContaoMaps
 *
 * @copyright  Cyberspectrum 2009
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    Controller
 */
class ModuleContaoMaps extends Module
{

	/**
	 * Template - just defined to have a non empty value and keep parent class from freaking out.
	 * @var string
	 */
	protected $strTemplate = 'mod_contaomaps';

	/**
	 * Display a wildcard in the back end
	 * @return string
	 */
	public function generate()
	{
		if (TL_MODE == 'BE')
		{
			$objTemplate = new backendTemplate('be_wildcard');
			$objTemplate->wildcard = '### CONTAO MAP '.$this->name.' ###';
			$objTemplate->title = $this->headline;
			$objTemplate->id = $this->id;
			$objTemplate->link = $this->name;
			$objTemplate->href = 'contao/main.php?do=modules&amp;act=edit&amp;id=' . $this->id;
			return $objTemplate->parse();
		}
		return parent::generate();
	}

	// ajax request for ourselves.
	public function generateAjax()
	{
		// select map from database.
		$objMap=ContaoMapDatabase::getMap($this->contaomaps_id);
		// make it collect all items.
		ContaoMapDatabase::collectLayers(
			$objMap,
			ContaoMapDatabase::getLayersForMapFromDB($this->contaomaps_id),
			array()
		);
		// return the content to the client.
		return $objMap->compileCustomIcons();
	}

	/**
	 * Generate module
	 */
	protected function compile()
	{
		$objMap=ContaoMapDatabase::getMap($this->contaomaps_id);
		global $objPage;
		$objMap->ajaxUrl = sprintf('%sajax.php?action=fmd&id=%s&page=%s', $this->Environment->base, $this->id, ($objPage?$objPage->id:0)).(defined('REQUEST_TOKEN')?'&bypassToken=1':'');
		foreach($objMap->getJavascript() as $script)
			$GLOBALS['TL_HEAD'][] = $script;
		$objMap->writeOptionsToTemplate($this->Template);
	}
}

?>
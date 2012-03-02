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
 * Add selectors to tl_module
 */
$GLOBALS['TL_DCA']['tl_module']['palettes']['__selector__'][] = 'contaomaps';

/**
 * Add palettes to tl_module
 */
$GLOBALS['TL_DCA']['tl_module']['palettes']['contaomaps'] = '{title_legend},name,type,headline,contaomaps_id;{protected_legend},guests,protected;{expert_legend},align,space,cssID';

/**
 * Add fields to tl_module
 */
$GLOBALS['TL_DCA']['tl_module']['fields']['contaomaps_id'] = array
(
	'label'                   => &$GLOBALS['TL_LANG']['tl_module']['contaomaps_id'],
	'inputType'               => 'select',
	'foreignKey'              => 'tl_contaomap.name',
	'eval'                    => array('mandatory'=>true, 'maxlength'=>64)
);

?>
<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * PHP version 5
 * @copyright  Cyberspectrum 2012
 * @author     Christian Schiffler <c.schiffler@cyberspectrum.de>
 * @package    ContaoMaps
 * @license    LGPL 
 * @filesource
 */

$GLOBALS['TL_DCA']['tl_contaomap'] = array
(
	// Config
	'config' => array
	(
		'dataContainer'					=> 'Table',
		'switchToEdit'					=> true,
		'enableVersioning'				=> true,
		'label'							=> &$GLOBALS['TL_LANG']['tl_contaomap']['title'],
		'onload_callback'             => array
			(
				array('tl_contaomap', 'checkUpgrade'),
			)
	),

	// List
	'list' => array
	(
		'sorting' => array
		(
			'mode'						=> 1,
			'fields'					=> array('name'),
			'flag'						=> 1,
			'panelLayout'				=> 'search,sort,filter,limit ',
			'icon'						=> 'system/modules/contaomaps/html/icon.gif',
		),
		'label' => array
		(
			'fields'					=> array('name'),
			'format'					=> '%s'
		),
		'global_operations' => array
		(
			'editlayer' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap']['editlayer'],
				'href'					=> 'table=tl_contaomap_layer',
				'class'					=> 'header_edit_layer',
			),
			'all' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['MSC']['all'],
				'href'					=> 'act=select',
				'class'					=> 'header_edit_all',
				'attributes'			=> 'onclick="Backend.getScrollOffset();"'
			),
		),
		'operations' => array
		(
			'edit' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap']['edit'],
				'href'					=> 'act=edit',
				'icon'					=> 'edit.gif',
			),
			'copy' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap']['copy'],
				'href'					=> 'act=copy',
				'icon'					=> 'copy.gif',
			),
			'delete' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap']['delete'],
				'href'					=> 'act=delete',
				'icon'					=> 'delete.gif',
				'attributes'			=> 'onclick="if (!confirm(\'' . $GLOBALS['TL_LANG']['MSC']['deleteConfirm'] . '\')) return false; Backend.getScrollOffset();"',
				'button_callback'     => array('tl_contaomap', 'deleteMap')
			),
			'show' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['tl_contaomap']['show'],
				'href'                => 'act=show',
				'icon'                => 'show.gif'
			),
		)
	),

	// Palettes
	'palettes' => array
	(
		'default'                     => '{title_legend},name,alttext;{map_legend},width,height,views,view,zoom,zoomcontrol,mapcontrol,sensor,coords;{template_legend},template;{mapcontents_legend},layerswitch,layer;{expert_legend},params'
	),

	// Fields
	'fields' => array
	(
		'name' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['name'],
			'exclude'                 => true,
			'inputType'               => 'text',
			'eval'                    => array('mandatory'=>true, 'maxlength'=>255, 'tl_class' => 'w50')
		),
		'coords' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['coords'],
			'inputType'               => 'geolookup',
			'search'                  => false,
			'eval'                    => array('mandatory'=>false, 'alwaysSave' => true),
		),
		'zoom' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['zoom'],
			'inputType'               => 'select',
			'options'                  => array('1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'),
			'search'                  => false,
			'eval'                    => array('mandatory'=>true, 'rgxp'=>'digit', 'tl_class' => 'w50')
		),
		'view' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['view'],
			'inputType'               => 'select',
			'options'                  => array('normalmap','satellitemap','hybridmap','physicalmap'),
			'reference'               => &$GLOBALS['TL_LANG']['tl_contaomap'],
			'search'                  => false,
			'eval'                    => array('mandatory'=>true, 'maxlength'=>64, 'tl_class' => 'w50')
		),
		'views' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['views'],
			'inputType'               => 'checkbox',
			'options'                  => array('normalmap','satellitemap','hybridmap','physicalmap'),
			'reference'               => &$GLOBALS['TL_LANG']['tl_contaomap'],
			'search'                  => false,
			'eval'                    => array('multiple'=>true,'mandatory'=>false, 'tl_class' => 'clr')
		),
		'zoomcontrol' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['zoomcontrol'],
			'inputType'               => 'select',
			'options'                  => array('none','large','small'),
			'reference'               => &$GLOBALS['TL_LANG']['tl_contaomap'],
			'search'                  => false,
			'eval'                    => array('mandatory'=>false, 'tl_class' => 'w50')
		),
		'mapcontrol' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['mapcontrol'],
			'inputType'               => 'select',
			'options'                  => array('none','normal','menu','hierarchical'),
			'reference'               => &$GLOBALS['TL_LANG']['tl_contaomap'],
			'search'                  => false,
			'eval'                    => array('mandatory'=>false, 'tl_class' => 'w50')
		),
		'width' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['width'],
			'inputType'               => 'inputUnit',
			'options'                  => array('px','%','em','pt','pc','in','cm','mm'),
			'search'                  => false,
			'eval'                    => array('rgxp'=>'digit', 'tl_class' => 'w50')
		),
		'height' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['height'],
			'inputType'               => 'inputUnit',
			'options'                  => array('px','%','em','pt','pc','in','cm','mm'),
			'search'                  => false,
			'eval'                    => array('rgxp'=>'digit', 'tl_class' => 'w50')
		),
		'alttext' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['alttext'],
			'inputType'               => 'text',
			'search'                  => false,
			'eval'                    => array('mandatory'=>false, 'maxlength'=>255, 'tl_class' => 'w50')
		),
		'params' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['params'],
			'inputType'               => 'textarea',
			'search'                  => false,
			'eval'                    => array('mandatory'=>false,'allowHtml'=>true, 'tl_class' => 'clr')
		),
		'sensor' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['sensor'],
			'inputType'               => 'checkbox',
			'eval'                    => array('tl_class' => 'w50')
		),
		'template' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['template'],
			'default'                 => 'mod_contaomaps',
			'exclude'                 => true,
			'inputType'               => 'select',
			'options'                 => $this->getTemplateGroup('mod_contaomaps'),
			'eval'                    => array('tl_class' => 'w50')
		),
		'layer' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['layer'],
			'inputType'               => 'checkbox',
			'foreignKey'              => 'tl_contaomap_layer.name',
			'eval'                    => array('multiple' => true, 'mandatory'=>true)
		),
		'layerswitch' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap']['layerswitch'],
			'inputType'               => 'checkbox',
		),
	)
);

class tl_contaomap extends Backend
{
	public function deleteMap($row, $href, $label, $title, $icon, $attributes)
	{
		return '<a href="'.$this->addToUrl($href.'&amp;id='.$row['id']).'" title="'.specialchars($title).'"'.$attributes.'>'.$this->generateImage($icon, $label).'</a> ';
	}
	public function getLayers(DataContainer $dc)
	{
		return array('internal' => 'Internal layer provider');
	}

	public function checkUpgrade()
	{
		// determine if we are upgrading from the never public released google map extension.
		if($this->Database->tableExists('tl_googlemaplayer'))
		{
			if($this->Database->tableExists('tl_googlemaps'))
				$this->Database->execute(sprintf('ALTER TABLE `%s` RENAME TO `%s`', 'tl_googlemaps', 'tl_contaomap'));
			if($this->Database->tableExists('tl_googlemapmarkers'))
				$this->Database->execute(sprintf('ALTER TABLE `%s` RENAME TO `%s`', 'tl_googlemapmarkers', 'tl_contaomap_marker'));
			if($this->Database->tableExists('tl_googlemappolygons'))
				$this->Database->execute(sprintf('ALTER TABLE `%s` RENAME TO `%s`', 'tl_googlemappolygons', 'tl_contaomap_polygon'));
			if($this->Database->tableExists('tl_googlemappolylines'))
				$this->Database->execute(sprintf('ALTER TABLE `%s` RENAME TO `%s`', 'tl_googlemappolylines', 'tl_contaomap_polyline'));
			if($this->Database->tableExists('tl_googlemaplayer'))
				$this->Database->execute(sprintf('ALTER TABLE `%s` RENAME TO `%s`', 'tl_googlemaplayer', 'tl_contaomap_layer'));
		}
	}
}
?>
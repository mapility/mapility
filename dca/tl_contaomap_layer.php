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
 * Table tl_contaomap_layer
 */

$GLOBALS['TL_DCA']['tl_contaomap_layer'] = array
(
	// Config()
	'config' => array
	(
		'dataContainer'					=> 'Table',
		'ctable'						=> array('tl_contaomap_marker', 'tl_contaomap_polygon', 'tl_contaomap_polyline'),
		'switchToEdit'					=> true,
		'enableVersioning'				=> true,
		'label'							=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['title'],
	),

	// List
	'list' => array
	(
		'sorting' => array
		(
			'mode'						=> 1,
			'fields'					=> array('name'),
			'flag'						=> 1,
			'panelLayout'				=> 'filter,limit',
			'headerFields'				=> array('name', 'tableName', 'tstamp', 'makeFeed'),
		),
		'label' => array
		(
			'fields'					=> array('name'),
			'format'					=> '%s',
			'label_callback'			=> array('tl_contaomap_layer', 'getLabel')
		),
		'global_operations' => array
		(
			'all' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['MSC']['all'],
				'href'					=> 'act=select',
				'class'					=> 'header_edit_all',
				'attributes'			=> 'onclick="Backend.getScrollOffset();"'
			),
			'back' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['MSC']['backBT'],
				'href'					=> 'do=contaomaps&table=',
				'class'					=> 'header_back',
				'attributes'			=> 'onclick="Backend.getScrollOffset();"'
			)
		),
		'operations' => array
		(
			'editmarkers' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['editmarkers'],
				'href'					=> 'table=tl_contaomap_marker',
				'icon'					=> 'system/modules/contaomaps/html/marker-edit.png',
				'button_callback'		=> array('tl_contaomap_layer', 'internalButton')
			),
			'editpolygons' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['editpolygons'],
				'href'					=> 'table=tl_contaomap_polygon',
				'icon'					=> 'system/modules/contaomaps/html/draw-polygon.png',
				'button_callback'		=> array('tl_contaomap_layer', 'internalButton')
			),
			'editpolylines' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['editpolylines'],
				'href'					=> 'table=tl_contaomap_polyline',
				'icon'					=> 'system/modules/contaomaps/html/draw-polyline.png',
				'button_callback'		=> array('tl_contaomap_layer', 'internalButton')
			),
			'edit' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['edit'],
				'href'					=> 'act=edit',
				'icon'					=> 'edit.gif',
			),
			'copy' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['copy'],
				'href'					=> 'act=copy',
				'icon'					=> 'copy.gif',
			),
			'delete' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['delete'],
				'href'					=> 'act=delete',
				'icon'					=> 'delete.gif',
				'attributes'			=> 'onclick="if (!confirm(\'' . $GLOBALS['TL_LANG']['MSC']['deleteConfirm'] . '\')) return false; Backend.getScrollOffset();"',
				'button_callback'		=> array('tl_contaomap_layer', 'deleteLayer')
			),
		)
	),
	// Palettes
	'palettes' => array
	(
		'__selector__'					=> array('type', 'mgrtype'),
		'default'						=> '{title_legend},name,alias,type,imageSize,ignore_area_filter,zindex,mgrtype',
		'internal'						=> '{title_legend},name,alias,type,imageSize,ignore_area_filter,zindex,mgrtype',
	),
	'subpalettes' => array
	(
		'mgrtype_markerclusterer'		=> 'clustermgr',
	),
	// Fields
	'fields' => array
	(
		'name' => array
		(
			'label'						=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['name'],
			'exclude'					=> true,
			'inputType'					=> 'text',
			'eval'						=> array('mandatory'=>true, 'maxlength'=>255, 'tl_class' => 'w50')
		),
		'alias' => array
		(
			'label'						=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['alias'],
			'inputType'					=> 'text',
			'search'					=> false,
			'eval'						=> array('mandatory'=>true, 'unique'=>true, 'maxlength'=>255, 'tl_class' => 'w50')
		),
		'type' => array
		(
			'label'						=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['type'],
			'default'					=> 'internal',
			'exclude'					=> true,
			'inputType'					=> 'select',
			'options_callback'			=> array('tl_contaomap_layer', 'getMapTypes'),
			'eval'						=> array('tl_class' => 'w50', 'mandatory' => true, 'submitOnChange'=>true)
		),
		'imageSize' => array
		(
			'label'						=> &$GLOBALS['TL_LANG']['tl_catalog_fields']['imageSize'],
			'exclude'					=> true,
			'inputType'					=> 'imageSize',
			'options'					=> array('crop', 'proportional', 'box'),
			'reference'					=> &$GLOBALS['TL_LANG']['MSC'],
			'eval'						=> array('rgxp'=>'digit', 'nospace'=>true, 'tl_class'=>'w50')
		),
		'mgrtype' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['mgrtype'],
			'default'                 => 'markermanager',
			'exclude'                 => true,
			'inputType'               => 'select',
			'options'                 => array('markermanager', 'markerclusterer'),
			'reference'               => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['mgrtype_ref'],
			'eval'                    => array('tl_class' => 'w50', 'mandatory' => true, 'submitOnChange'=>true)
		),
		'clustermgr' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['clustermgr'],
			'inputType'               => 'textarea',
			'search'                  => false,
		),
		'ignore_area_filter' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['ignore_area_filter'],
			'exclude'                 => true,
			'inputType'               => 'checkbox',
			'eval'                    => array('rgxp'=>'digit', 'nospace'=>true, 'tl_class'=>'w50')
		),
		'zindex' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['zIndex'],
			'inputType'               => 'text',
			'search'                  => false,
			'eval'                    => array('rgxp' => 'digit', 'tl_class' => 'w50')
		),
		'source' => array
		(
			'label'						=> &$GLOBALS['TL_LANG']['tl_contaomap_layer']['source'],
			'eval'						=> array('fieldType'=>'radio', 'files'=>true, 'filesOnly'=>true, 'extensions'=>'gpx')
		)
	)
);

class tl_contaomap_layer extends Backend
{
	public function deleteLayer($row, $href, $label, $title, $icon, $attributes)
	{
		return '<a href="'.$this->addToUrl($href.'&amp;id='.$row['id']).'" title="'.specialchars($title).'"'.$attributes.'>'.$this->generateImage($icon, $label).'</a> ';
	}


	public function internalButton($row, $href, $label, $title, $icon, $attributes)
	{
		if($row['type']=='internal')
			return '<a href="'.$this->addToUrl($href.'&amp;id='.$row['id']).'" title="'.specialchars($title).'"'.$attributes.'>'.$this->generateImage($icon, $label).'</a> ';
		else return '';
	}

	/**
	 * Add the type of layer to the Layer
	 * @param array
	 * @return string
	 */
	public function getLabel($arrRow)
	{
		$type=$GLOBALS['TL_LANG']['tl_contaomap_layer']['types'][$arrRow['type']]?$GLOBALS['TL_LANG']['tl_contaomap_layer']['types'][$arrRow['type']]:$arrRow['type'];

		return '<div class="field_heading cte_type"><strong>' . $arrRow['name'] . '</strong> <em>['.$type.']</em></div>';
	}

	/**
	 * Return all map layer types as array
	 * @param object
	 * @return string
	 */
	public function getMapTypes(DataContainer $dc)
	{
		$ret=array('internal' => &$GLOBALS['TL_LANG']['tl_contaomap_layer']['types']['internal']);
		if(!is_array($GLOBALS['CONTAOMAP_MAPLAYERS']))
		  	return $ret;
		foreach($GLOBALS['CONTAOMAP_MAPLAYERS'] as $k=>$class)
			$ret[$k] = $GLOBALS['TL_LANG']['tl_contaomap_layer']['types'][$k]?$GLOBALS['TL_LANG']['tl_contaomap_layer']['types'][$k]:$k;
		return $ret;
	}

	/**
	 * Generate a "switch account" button and return it as string
	 * @param array
	 * @param string
	 * @param string
	 * @param string
	 * @param string
	 * @return string
	 */
	public function editLayer($row, $href, $label, $title, $icon)
	{
		return '<a href="'.$this->addToUrl($href.'&amp;id='.$row['id']).'" title="'.specialchars($title).'">'.$this->generateImage($icon, $label).'</a> ';
	}
}

?>
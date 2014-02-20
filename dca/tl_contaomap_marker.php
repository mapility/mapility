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
 * Table structure for tl_contaomap_marker
 */

$GLOBALS['TL_DCA']['tl_contaomap_marker'] = array
(
	// Config
	'config' => array
	(
		'dataContainer'					=> 'Table',
		'ptable'						=> 'tl_contaomap_layer',
		'enableVersioning'				=> false,
	),

	// List
	'list' => array
	(
		'sorting' => array
		(
			'mode'						=> 1,
			'fields'					=> array('name'),
			'flag'						=> 3,
			'panelLayout'				=> 'filter;search,limit',
		),
		'label' => array
		(
			'fields'					=> array('name', 'latitude', 'longitude'),
			'format'                  => '%s <span style="color:#b3b3b3; padding-left:3px;">[%s,%s]</span>'
		),
		
		'global_operations' => array
		(
			'all' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['MSC']['all'],
				'href'					=> 'act=select',
				'class'					=> 'header_edit_all',
				'attributes'			=> 'onclick="Backend.getScrollOffset();"'
			)
		),
		'operations' => array
		(
			'edit' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_marker']['edit'],
				'href'					=> 'act=edit',
				'icon'					=> 'edit.gif',
			),
			'copy' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_marker']['copy'],
				'href'					=> 'act=paste&amp;mode=copy',
				'icon'					=> 'copy.gif',
			),
			'cut' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_marker']['cut'],
				'href'					=> 'act=paste&amp;mode=cut',
				'icon'					=> 'cut.gif',
			),
			'delete' => array
			(
				'label'					=> &$GLOBALS['TL_LANG']['tl_contaomap_marker']['delete'],
				'href'					=> 'act=delete',
				'icon'					=> 'delete.gif',
				'attributes'			=> 'onclick="if (!confirm(\'' . $GLOBALS['TL_LANG']['MSC']['deleteConfirm'] . '\')) return false; Backend.getScrollOffset();"',
			),
			'toggle' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['toggle'],
				'icon'                => 'visible.gif',
				'attributes'          => 'onclick="Backend.getScrollOffset(); return AjaxRequest.toggleVisibility(this, %s);"',
				'button_callback'     => array('tl_contaomap_marker', 'toggleIcon')
			),
			'show' => array
			(
				'label'               => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['show'],
				'href'                => 'act=show',
				'icon'                => 'show.gif'
			),
		)
	),

	// Palettes
	'palettes' => array
	(
		'default'                     => '{title_legend},name,published,coords,anchor,info_anchor,info_auto,icon,shadow,text',
		'embeddededit'                => 'name,text'
	),

	// Fields
	'fields' => array
	(
		'name' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['name'],
			'exclude'                 => true,
			'inputType'               => 'text',
			'eval'                    => array('mandatory'=>true, 'maxlength'=>255, 'tl_class' => 'w50')
		),
		'coords' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['coords'],
			'inputType'               => 'geolookup',
			'search'                  => false,
			'eval'                    => array('mandatory'=>false, 'alwaysSave' => true),
			'save_callback' => array(array('tl_contaomap_marker', 'onSave')),
		),
		'icon' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['icon'],
			'inputType'               => 'fileTree',
			'search'                  => false,
			'eval'                    => array('files'=>true,'filesOnly'=>true,'fieldType'=>'radio','maxlength'=>255, 'tl_class' => 'clr')
		),
		'shadow' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['shadow'],
			'inputType'               => 'fileTree',
			'search'                  => false,
			'eval'                    => array('files'=>true,'filesOnly'=>true,'fieldType'=>'radio','maxlength'=>255)
		),
		'anchor' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['anchor'],
			'inputType'               => 'text',
			'search'                  => false,
			'eval'                    => array('maxlength'=>64, 'tl_class' => 'w50')
		),
		'info_anchor' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['info_anchor'],
			'inputType'               => 'text',
			'search'                  => false,
			'eval'                    => array('maxlength'=>64, 'tl_class' => 'w50')
		),
		'text' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['text'],
			'inputType'               => 'textarea',
			'search'                  => false,
			'eval'                    => array('mandatory'=>true, 'rows'=>4,'allowHtml'=>true, 'rte' => 'tinyMCE')
		),
		'info_auto' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['info_auto'],
			'exclude'                 => false,
			'inputType'               => 'checkbox',
			'eval'                    => array('maxlength'=>64, 'tl_class' => 'w50')
		),
		'published' => array
		(
			'label'                   => &$GLOBALS['TL_LANG']['tl_contaomap_marker']['published'],
			'exclude'                 => true,
			'filter'                  => true,
			'flag'                    => 1,
			'inputType'               => 'checkbox',
			'eval'                    => array('doNotCopy'=>true)
		)
	)
);

class tl_contaomap_marker extends Backend
{

	/**
	 * Import the back end user object
	 */
	public function __construct()
	{
		parent::__construct();
		$this->import('BackendUser', 'User');
	}

	/*
	 * Helper function to transfer coordinates into the separate columns
	 */
	public function onSave($varValue, DataContainer $dc) {
		// migrate values to location table.
		$latLng=explode(',', $varValue);
		$this->Database->prepare('UPDATE tl_contaomap_marker SET latitude=?, longitude=? WHERE id=?')
						->execute($latLng[0], $latLng[1], $dc->id);
		return $varValue;
	}

	/**
	 * Check permissions to edit table tl_news
	 */
	public function checkPermission()
	{

		if ($this->User->isAdmin)
		{
			return;
		}

		// Set root IDs
		if (!is_array($this->User->maplayer) || count($this->User->maplayer) < 1)
		{
			$root = array(0);
		}
		else
		{
			$root = $this->User->maplayer;
		}

		$id = strlen(\Input::get('id')) ? \Input::get('id') : CURRENT_ID;

		// Check current action
		switch (\Input::get('act'))
		{
			case 'paste':
				// Allow
				break;

			case 'create':
				if (!strlen(\Input::get('pid')) || !in_array(\Input::get('pid'), $root))
				{
					$this->log('Not enough permissions to create markers in layer ID "'.\Input::get('pid').'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}
				break;

			case 'cut':
			case 'copy':
				if (!in_array(\Input::get('pid'), $root))
				{
					$this->log('Not enough permissions to '.\Input::get('act').' marker "'.$id.'" to layer ID "'.\Input::get('pid').'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}
				// NO BREAK STATEMENT HERE

			case 'edit':
			case 'show':
			case 'delete':
			case 'toggle':
				$objArchive = $this->Database->prepare("SELECT pid FROM tl_contaomap_marker WHERE id=?")
											 ->limit(1)
											 ->execute($id);

				if ($objArchive->numRows < 1)
				{
					$this->log('Invalid marker ID "'.$id.'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}

				if (!in_array($objArchive->pid, $root))
				{
					$this->log('Not enough permissions to '.\Input::get('act').' marker ID "'.$id.'" of layer ID "'.$objArchive->pid.'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}
				break;

			case 'select':
			case 'editAll':
			case 'deleteAll':
			case 'overrideAll':
			case 'cutAll':
			case 'copyAll':
				if (!in_array($id, $root))
				{
					$this->log('Not enough permissions to access layer ID "'.$id.'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}

				$objArchive = $this->Database->prepare("SELECT id FROM tl_contaomap_marker WHERE pid=?")
											 ->execute($id);

				if ($objArchive->numRows < 1)
				{
					$this->log('Invalid layer ID "'.$id.'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}

				$session = $this->Session->getData();
				$session['CURRENT']['IDS'] = array_intersect($session['CURRENT']['IDS'], $objArchive->fetchEach('id'));
				$this->Session->setData($session);
				break;

			default:
				if (strlen(\Input::get('act')))
				{
					$this->log('Invalid command "'.\Input::get('act').'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}
				elseif (!in_array($id, $root))
				{
					$this->log('Not enough permissions to access layer ID "'.$id.'"', 'tl_contaomap_marker checkPermission', TL_ERROR);
					$this->redirect('contao/main.php?act=error');
				}
				break;
		}
	}

	/**
	 * Return the "toggle visibility" button
	 * @param array
	 * @param string
	 * @param string
	 * @param string
	 * @param string
	 * @param string
	 * @return string
	 */
	public function toggleIcon($row, $href, $label, $title, $icon, $attributes)
	{
		if (strlen(\Input::get('tid')))
		{
			$this->toggleVisibility(\Input::get('tid'), (\Input::get('state') == 1));
			$this->redirect($this->getReferer());
		}

		// Check permissions AFTER checking the tid, so hacking attempts are logged
		if (!$this->User->isAdmin && !$this->User->hasAccess('tl_contaomap_marker::published', 'alexf'))
		{
			return '';
		}

		$href .= '&amp;tid='.$row['id'].'&amp;state='.($row['published'] ? '' : 1);

		if (!$row['published'])
		{
			$icon = 'invisible.gif';
		}		

		return '<a href="'.$this->addToUrl($href).'" title="'.specialchars($title).'"'.$attributes.'>'.$this->generateImage($icon, $label).'</a> ';
	}

	/**
	 * Disable/enable a user group
	 * @param integer
	 * @param boolean
	 */
	public function toggleVisibility($intId, $blnVisible)
	{
		// Check permissions to edit
		\Input::setGet('id', $intId);
		\Input::setGet('act', 'toggle');
		$this->checkPermission();
		// Check permissions to publish
		if (!$this->User->isAdmin && !$this->User->hasAccess('tl_contaomap_marker::published', 'alexf'))
		{
			$this->log('Not enough permissions to publish/unpublish news item ID "'.$intId.'"', 'tl_contaomap_marker toggleVisibility', TL_ERROR);
			$this->redirect('contao/main.php?act=error');
		}
		$this->createInitialVersion('tl_contaomap_marker', $intId);
		// Trigger the save_callback
		if (is_array($GLOBALS['TL_DCA']['tl_news']['fields']['published']['save_callback']))
		{
			foreach ($GLOBALS['TL_DCA']['tl_news']['fields']['published']['save_callback'] as $callback)
			{
				$this->import($callback[0]);
				$blnVisible = $this->$callback[0]->$callback[1]($blnVisible, $this);
			}
		}
		// Update the database
		$this->Database->prepare("UPDATE tl_contaomap_marker SET tstamp=". time() .", published='" . ($blnVisible ? 1 : '') . "' WHERE id=?")
					   ->execute($intId);
		$this->createNewVersion('tl_contaomap_marker', $intId);
	}
}

?>
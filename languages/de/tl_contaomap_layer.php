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
 * Fields
 */
$GLOBALS['TL_LANG']['tl_contaomap_layer']['name']= array('Bezeichner für den Kartenlayer', 'Bitte geben Sie einen Bezeichner für den Layer ein.');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['alias']= array('Alias', 'Bitte geben Sie den Alias für diesen Layer ein ein.');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['type']= array('Layer Typ', 'Bitte wählen Sie die den Typ des Layers.');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_contaomap_layer']['title_legend']= 'Layerkonfiguration';

/**
 * Buttons
 */
$GLOBALS['TL_LANG']['tl_contaomap_layer']['new']          = array('Neuer Layer', 'Einen neuen Layer erstellen');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['show']         = array('Layerdetails', 'Die Details des Layers ID %s anzeigen');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['edit']         = array('Layer bearbeiten', 'Layer ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['copy']         = array('Layer duplizieren', 'Layer ID %s duplizieren');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['delete']       = array('Layer löschen', 'Layer ID %s löschen');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['editmarkers']  = array('Marker bearbeiten', 'Marker des Layers %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['editpolygons'] = array('Polygone bearbeiten', 'Polygone des Layers ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_layer']['editpolylines'] = array('Polylinien bearbeiten', 'Polylinien des Layers ID %s bearbeiten');

/**
 * Layer types
 */
$GLOBALS['TL_LANG']['tl_contaomap_layer']['types']['internal']='Interner layer';

?>
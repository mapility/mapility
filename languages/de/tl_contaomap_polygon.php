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
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['name']= array('Bezeichner für das Polygon', 'Bitte geben Sie einen Bezeichner für das Polygon ein, dieser wird nur intern verwendet.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['published']= array('Veröffentlichen', 'Wählen Sie, ob das Polygon angezeigt werden soll.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['coords']= array('Koordinaten des Polygons', 'Die Koordinatenpaare des Polygons. Eine Koordinate pro Zeile.');

$GLOBALS['TL_LANG']['tl_contaomap_polygon']['strokeweight']= array('Linienstärke', 'Die Linienstärke für die Umrandung in Pixel.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['strokecolor']= array('Linienfarbe', 'Die Farbe für die Umrandung.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['strokeopacity']= array('Linientransparenz in Prozent', 'Geben Sie die Linientransparenz in Prozent (0=unsichtbar, 100=volle Abdeckung) ein.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['fillcolor']= array('Füllfarbe', 'Die Farbe für die Füllung.');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['fillopacity']= array('Füllungstransparenz in Prozent', 'Geben Sie die Füllungstransparenz in Prozent (0=unsichtbar, 100=volle Abdeckung) ein.');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['title_legend']= 'Polygonkonfiguration';

/**
 * Buttons
 */
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['new']      = array('Neues Polygon', 'Ein neues Polygon erstellen');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['edit']     = array('Polygon bearbeiten', 'Polygon ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['copy']     = array('Polygon duplizieren', 'Polygon ID %s duplizieren');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['cut']     = array('Polygon ausschneiden', 'Polygon ID %s ausschneiden');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['delete']   = array('Polygon löschen', 'Polygon ID %s löschen');
$GLOBALS['TL_LANG']['tl_contaomap_polygon']['show']     = array('Polygondetails', 'Die Details der Polygon ID %s anzeigen');

?>
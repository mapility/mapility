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
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['name']= array('Bezeichner für die Polylinie', 'Bitte geben Sie einen Bezeichner für das Polygon ein, dieser wird nur intern verwendet.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['published']= array('Veröffentlichen', 'Wählen Sie, ob die Polylinie angezeigt werden soll.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['coords']= array('Koordinaten der Polylinie', 'Die Koordinatenpaare der Polylinie. Eine Koordinate pro Zeile.');

$GLOBALS['TL_LANG']['tl_contaomap_polyline']['strokeweight']= array('Linienstärke', 'Die Linienstärke für die Umrandung in Pixel.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['strokecolor']= array('Linienfarbe', 'Die Farbe für die Umrandung.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['strokeopacity']= array('Linientransparenz in Prozent', 'Geben Sie die Linientransparenz in Prozent (0=unsichtbar, 100=volle Abdeckung) ein.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['fillcolor']= array('Füllfarbe', 'Die Farbe für die Füllung.');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['fillopacity']= array('Füllungstransparenz in Prozent', 'Geben Sie die Füllungstransparenz in Prozent (0=unsichtbar, 100=volle Abdeckung) ein.');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['title_legend']= 'Polylinienkonfiguration';

/**
 * Buttons
 */
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['new']      = array('Neue Polylinie', 'Eine neue Polylinie erstellen');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['edit']     = array('Polylinie bearbeiten', 'Polylinie ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['copy']     = array('Polylinie duplizieren', 'Polylinie ID %s duplizieren');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['cut']     = array('Polylinie ausschneiden', 'Polylinie ID %s ausschneiden');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['delete']   = array('Polylinie löschen', 'Polylinie ID %s löschen');
$GLOBALS['TL_LANG']['tl_contaomap_polyline']['show']     = array('Polyliniendetails', 'Die Details der Polylinie ID %s anzeigen');

?>
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
$GLOBALS['TL_LANG']['tl_contaomap']['name']= array('Bezeichner für die Karte', 'Bitte geben Sie einen Bezeichner für die Karte ein, dieser wird nur intern verwendet.');
$GLOBALS['TL_LANG']['tl_contaomap']['alttext']= array('Alternativer Text', 'Geben Sie hier einen Text ein, welcher auf Ausgabegeräten angezeigt werden soll, die keine Kartenanzeige unterstützen.');
$GLOBALS['TL_LANG']['tl_contaomap']['width']= array('Breite', 'Bitte geben Sie die Breite der Karte in Pixeln ein.');
$GLOBALS['TL_LANG']['tl_contaomap']['height']= array('Höhe', 'Bitte geben Sie die Höhe der Karte in Pixeln ein.');
$GLOBALS['TL_LANG']['tl_contaomap']['views']= array('Wählbare Ansichten', 'Bitte wählen Sie die verfügbaren Ansichten der Karte.');
$GLOBALS['TL_LANG']['tl_contaomap']['view']= array('Standard-Ansicht', 'Bitte wählen Sie die Standard-Ansicht der Karte.');
$GLOBALS['TL_LANG']['tl_contaomap']['zoom']= array('Zoom-Stufe', 'Bitte wählen Sie die initiale Vergößerung.');
$GLOBALS['TL_LANG']['tl_contaomap']['zoomcontrol']= array('Zoom-Controller', 'Bitte wählen Sie aus, welcher Controller zur Bewegung innerhalb der Karte vorhanden ist.');
$GLOBALS['TL_LANG']['tl_contaomap']['mapcontrol']= array('Kartenansichts-Controller', 'Bitte wählen Sie aus, welcher Controller zum Wechsel der Kartenansicht vorhanden ist.');
$GLOBALS['TL_LANG']['tl_contaomap']['sensor']= array('Sensor', 'Bitte wählen Sie, ob versucht werden soll die Position des Besuchers zu ermitteln und die Karte auf diese zentriert werden soll.');
$GLOBALS['TL_LANG']['tl_contaomap']['scrollwheel']= array('Scrollrad ausschalten', 'Aktivieren Sie diese Checkbox, wenn das Scrollrad auf der Karte keine Funktion haben soll.');
$GLOBALS['TL_LANG']['tl_contaomap']['coords']= array('Koordinaten des Kartenzentrums', 'Bitte geben Sie die Koordinaten ein, auf die die Karte zentriert werden soll.');
$GLOBALS['TL_LANG']['tl_contaomap']['template']= array('Template', 'Verwendetes Template.');
$GLOBALS['TL_LANG']['tl_contaomap']['layer']= array('Layer', 'Wählen Sie hier alle Kartenlayer, welche in dieser Karte angezeigt werden sollen.');
$GLOBALS['TL_LANG']['tl_contaomap']['params']= array('Weitere Parameter', 'Hier können weitere Parameter eingegeben werden, z.B. zur Erzeugung multipler Markierungen.');
$GLOBALS['TL_LANG']['tl_contaomap']['styles']= array('Styles', 'Hier können Styles als JSON-Array mit Style-Objekten übergeben. Siehe auch http://goo.gl/yOve');

/**
 * References
 */
$GLOBALS['TL_LANG']['tl_contaomap']['normalmap']= 'Karte';
$GLOBALS['TL_LANG']['tl_contaomap']['satellitemap']= 'Satellit';
$GLOBALS['TL_LANG']['tl_contaomap']['hybridmap']= 'Hybrid';
$GLOBALS['TL_LANG']['tl_contaomap']['physicalmap']= 'Gelände';
$GLOBALS['TL_LANG']['tl_contaomap']['none']= 'kein Controller';
$GLOBALS['TL_LANG']['tl_contaomap']['large']= 'groß';
$GLOBALS['TL_LANG']['tl_contaomap']['small']= 'klein';
$GLOBALS['TL_LANG']['tl_contaomap']['normal']= 'Standardcontroller';
$GLOBALS['TL_LANG']['tl_contaomap']['menu']= 'Menu';
$GLOBALS['TL_LANG']['tl_contaomap']['hierarchical']= 'Verschachtelt';

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_contaomap']['title_legend']       = 'Basisinformationen';
$GLOBALS['TL_LANG']['tl_contaomap']['map_legend']         = 'Kartenkonfiguration';
$GLOBALS['TL_LANG']['tl_contaomap']['template_legend']    = 'Templateeinstellungen';
$GLOBALS['TL_LANG']['tl_contaomap']['mapcontents_legend'] = 'Karteninhalte';
$GLOBALS['TL_LANG']['tl_contaomap']['expert_legend']      = 'Experteneinstellungen';

/**
 * Buttons
 */
$GLOBALS['TL_LANG']['tl_contaomap']['new']      = array('Neue Karte', 'Eine neue Karte erstellen');
$GLOBALS['TL_LANG']['tl_contaomap']['show']     = array('Kartendetails', 'Die Details der Karte ID %s anzeigen');
$GLOBALS['TL_LANG']['tl_contaomap']['edit']     = array('Karte bearbeiten', 'Karte ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap']['copy']     = array('Karte duplizieren', 'Karte ID %s duplizieren');
$GLOBALS['TL_LANG']['tl_contaomap']['delete']   = array('Karte löschen', 'Karte ID %s löschen');
$GLOBALS['TL_LANG']['tl_contaomap']['editlayer']= array('Kartenlayer bearbeiten', 'Die verfügbaren Kartenlayer bearbeiten');

?>
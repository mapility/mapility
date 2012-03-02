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
$GLOBALS['TL_LANG']['tl_contaomap_marker']['name']= array('Bezeichner für den Marker', 'Bitte geben Sie einen Bezeichner für den Marker ein, dieser wird nur intern verwendet.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['published']= array('Veröffentlichen', 'Wählen Sie, ob der Marker angezeigt werden soll.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['coords']= array('Koordinaten der Markierung', 'Die Koordinaten der Markierung können von der Kartenmitte abweichen. Ein leeres Feld setzt die Markierung in die Kartenmitte.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['icon']= array('Individuelles Icon', 'Es kann ein eigenes Icon verwendet werden, z.B. ein Firmenlogo. Ohne Auswahl wird das Standard-Icon des Kartenanbieters verwendet.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['shadow']= array('Individueller Schatten', 'Auch für eigene Icons können Schatten gesetzt werden.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['anchor']= array('Position der Markierung', 'Die Position der Markierung kann über ein Koordinatenpaar LINKS,RAUF verändert werden. 5,10 verschiebt die Box z.B. von der linken oberen Ecke des Icons um 5 Pixel nach links und 10 Pixel nach oben.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['text']= array('Inhalt der Textbox', 'Es können einfache Formatierungen verwendet werden.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['info_anchor']= array('Position der Textbox', 'Die Position der Textbox kann über ein Koordinatenpaar RECHTS,RUNTER verändert werden. 10,5 verschiebt die Box z.B. von der linken oberen Ecke des Icons um 10 Pixel nach rechts und 5 Pixel nach unten.');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['info_auto']= array('Textbox automatisch öffnen', 'Wenn deaktiviert, öffnet sich die Textbox nur durch einen Klick auf das Icon.');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_contaomap_marker']['title_legend']= 'Markierungskonfiguration';

/**
 * Buttons
 */
$GLOBALS['TL_LANG']['tl_contaomap_marker']['new']      = array('Neue Markierung', 'Eine neue Markierung erstellen');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['edit']     = array('Markierung bearbeiten', 'Markierung ID %s bearbeiten');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['copy']     = array('Markierung duplizieren', 'Markierung ID %s duplizieren');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['cut']     = array('Markierung ausschneiden', 'Markierung ID %s ausschneiden');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['delete']   = array('Markierung löschen', 'Markierung ID %s löschen');
$GLOBALS['TL_LANG']['tl_contaomap_marker']['show']     = array('Markierungsdetails', 'Die Details der Markierung ID %s anzeigen');

?>
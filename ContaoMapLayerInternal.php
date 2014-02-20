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
 * class ContaoMapObject
 */
class ContaoMapLayerInternal extends ContaoMapLayer
{
	public function getProperties()
	{
		return array_keys($this->arrData);
	}

	protected function assembleMarkers($omitIds)
	{
		$strClass=$GLOBALS['CONTAOMAP_MAPOBJECTS']['marker'];
		if(!$strClass)
			return;
		// assemble all user defined markers having valid coordinates from the database.
		$omitSQL = (!BE_USER_LOGGED_IN?' AND published=1':'').($omitIds?' AND id NOT IN ('.implode(', ', $omitIds).') ':'');
		$areaFilter = $this->getAreaFilter('latitude', 'longitude');
		$objMarkers=\Database::getInstance()->prepare('SELECT * FROM tl_contaomap_marker WHERE pid=? '.$omitSQL.($areaFilter?' AND '.$areaFilter:''))
									->execute(intval($this->id));
		// loop over items and add them to the output.
		while($objMarkers->next())
		{
			$objMarker = new $strClass(array(
				'jsid' => 'marker_'.$objMarkers->id
			));
			$objMarker->longitude = $objMarkers->longitude;
			$objMarker->latitude = $objMarkers->latitude;
			$objMarker->altitude = $objMarkers->altitude;
			if($objLayer->zindex)
				$objMarker->zindex = $objLayer->zindex;
			if($objMarkers->name)
				$objMarker->name = $objMarkers->name;
			$objIcon=\FilesModel::findByUuid($objMarkers->icon);

			if($objIcon)
			{
				$objMarker->icon = $objIcon->path;
				$objIcon = new File($objIcon->path);
				$objMarker->iconsize = $objIcon->width.','.$objIcon->height;
				if($objMarkers->anchor)
					$objMarker->iconposition = $objMarkers->anchor;
				else
					$objMarker->iconposition = sprintf('%s,%s', floor($objIcon->width/2), floor($objIcon->height/2));
			}
			if($objMarkers->shadow)
				$objMarker->shadow = $objMarkers->shadow;
			if($objMarkers->shadowsize)
				$objMarker->shadowsize = $objMarkers->shadowsize;
			if($objMarkers->text)
				$objMarker->infotext = $objMarkers->text;
			if($objMarkers->info_anchor)
				$objMarker->infoposition = $objMarkers->info_anchor;
			if($objMarkers->info_auto)
				$objMarker->autoinfo = $objMarkers->info_auto;
			$this->add($objMarker);
		}
	}

	protected function assemblePolygons($omitIds)
	{
		$strClass=$GLOBALS['CONTAOMAP_MAPOBJECTS']['polygon'];
		if(!$strClass)
			return;
		$omitSQL = (!BE_USER_LOGGED_IN?' AND published=1':'').($omitPolygons?' AND id NOT IN ('.implode(', ', $omitPolygons).')':'');
		$areaFilter = $this->getAreaIntersectFilter('min_latitude', 'max_latitude', 'min_longitude', 'max_longitude');
		$objPolygons=\Database::getInstance()->prepare('SELECT * FROM tl_contaomap_polygon WHERE pid=? '.$omitSQL.($areaFilter?' AND '.$areaFilter:''))
									->execute(intval($this->id));
		while($objPolygons->next())
		{
			$objPolygon = new $strClass(array(
				'jsid' => 'polygon_'.$objPolygons->id
			));
			$objPolygon->strokecolor=$objPolygons->strokecolor?'#'.$objPolygons->strokecolor:'';
			$objPolygon->strokeweight=$objPolygons->strokeweight;
			$objPolygon->strokeopacity=$objPolygons->strokeopacity/100;
			$objPolygon->fillcolor=$objPolygons->fillcolor?'#'.$objPolygons->fillcolor:'';
			$objPolygon->fillopacity=$objPolygons->fillopacity/100;
			$points=explode("\n", $objPolygons->coords);
			$arrPoints=array();
			foreach($points as $point)
				$arrPoints[]=explode(',', $point);
			$objPolygon->points=$arrPoints;
			$this->add($objPolygon);
		}
	}

	protected function assemblePolylines($omitIds)
	{
		$strClass=$GLOBALS['CONTAOMAP_MAPOBJECTS']['polyline'];
		if(!$strClass)
			return;
		$omitSQL = (!BE_USER_LOGGED_IN?' AND published=1':'').($omitPolylines?' AND id NOT IN ('.implode(', ', $omitPolylines).')':'');
		$areaFilter = $this->getAreaIntersectFilter('min_latitude', 'max_latitude', 'min_longitude', 'max_longitude');
		$objPolylines=\Database::getInstance()->prepare('SELECT * FROM tl_contaomap_polyline WHERE pid=? '.$omitSQL.($areaFilter?' AND '.$areaFilter:''))
									->execute(intval($this->id));
		while($objPolylines->next())
		{
			$objPolyline = new $strClass(array(
				'jsid' => 'polyline_'.$objPolylines->id
			));
			$objPolyline->strokecolor=$objPolylines->strokecolor?'#'.$objPolylines->strokecolor:'';
			$objPolyline->strokeweight=$objPolylines->strokeweight;
			$objPolyline->strokeopacity=$objPolylines->strokeopacity/100;
			$points=explode("\n", $objPolylines->coords);
			$arrPoints=array();
			foreach($points as $point)
				$arrPoints[]=explode(',', $point);
			$objPolyline->points=$arrPoints;
			$this->add($objPolyline);
		}
	}

	/**
	 * This makes the layer generate all objects valid to the current request.
	 * @param array $omitObjects this array holds all objects already known to the map and that therefore shall not be returned.
	 * @return void
	 */
	public function assembleObjects($omitObjects)
	{
		$omitIds=($omitObjects['marker'])?filter_var_array($omitObjects['marker'], FILTER_SANITIZE_NUMBER_INT):array();
		$this->assembleMarkers($omitIds);

		$omitIds=($omitObjects['polygon'])?filter_var_array($omitObjects['polygon'], FILTER_SANITIZE_NUMBER_INT):array();
		$this->assemblePolygons($omitIds);

		$omitIds=($omitObjects['polyline'])?filter_var_array($omitObjects['polyline'], FILTER_SANITIZE_NUMBER_INT):array();
		$this->assemblePolylines($omitIds);
	}

}

?>
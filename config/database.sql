-- **********************************************************
-- *                                                        *
-- * IMPORTANT NOTE                                         *
-- *                                                        *
-- * Do not import this file manually but use the TYPOlight *
-- * install tool to create and maintain database tables!   *
-- *                                                        *
-- **********************************************************

--
-- Table `tl_modules`
--

CREATE TABLE `tl_module` (
  `contaomaps_id` int(10) NOT NULL default '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table `tl_contaomap`
--

CREATE TABLE `tl_contaomap` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pid` int(10) unsigned NOT NULL default '0',
  `tstamp` int(10) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `coords` varchar(64) NOT NULL default '',
  `zoom` varchar(64) NOT NULL default '',
  `view` varchar(64) NOT NULL default '',
  `views` varchar(255) NOT NULL default '',
  `width` varchar(64) NOT NULL default '',
  `height` varchar(64) NOT NULL default '',
  `zoomcontrol` varchar(64) NOT NULL default '',
  `mapcontrol` varchar(64) NOT NULL default '',
  `params` text NOT NULL,
  `alttext` varchar(255) NOT NULL default '',
  `sensor` char(1) NOT NULL default '',
  `template` varchar(64) NOT NULL default '',
  `layer` blob NULL,
  `layerswitch` char(1) NOT NULL default '0',
  `loadinganimation` char(1) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table `tl_contaomap_layer`
--
CREATE TABLE `tl_contaomap_layer` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pid` int(10) unsigned NOT NULL default '0',
  `tstamp` int(10) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `alias` varchar(255) NOT NULL default '',
  `type` varchar(255) NOT NULL default '',
  `mgrtype` varchar(16) NOT NULL default 'markermanager',
  `imageSize` varchar(255) NOT NULL default '16',
  `clustermgr` blob NULL,
  `ignore_area_filter` char(1) NOT NULL default '',
  `zindex` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table `tl_contaomap_marker`
--
CREATE TABLE `tl_contaomap_marker` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pid` int(10) unsigned NOT NULL default '0',
  `tstamp` int(10) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `coords` varchar(64) NOT NULL default '',
  `latitude` float(10,7) NOT NULL default '0.0000000',
  `longitude` float(10,7) NOT NULL default '0.0000000'
  `icon` binary(16) NULL,
  `shadow` binary(16) NULL,
  `anchor` varchar(64) NOT NULL default '',
  `text` text NULL,
  `info_anchor` varchar(64) NOT NULL default '',
  `info_auto` char(1) NOT NULL default '',
  `published` char(1) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table `tl_contaomap_polygon`
--
CREATE TABLE `tl_contaomap_polygon` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pid` int(10) unsigned NOT NULL default '0',
  `tstamp` int(10) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `min_latitude` float(10,7) NOT NULL default '0.0000000',
  `min_longitude` float(10,7) NOT NULL default '0.0000000'
  `max_latitude` float(10,7) NOT NULL default '0.0000000',
  `max_longitude` float(10,7) NOT NULL default '0.0000000'
  `coords` longblob NULL,
  `strokecolor` varchar(6) NOT NULL default '',
  `strokeweight` int(3) unsigned NOT NULL default '0',
  `strokeopacity` varchar(6) NOT NULL default '',
  `fillcolor` varchar(6) NOT NULL default '',
  `fillopacity` varchar(6) NOT NULL default '',
  `published` char(1) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


--
-- Table `tl_contaomap_polyline`
--
CREATE TABLE `tl_contaomap_polyline` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `pid` int(10) unsigned NOT NULL default '0',
  `tstamp` int(10) unsigned NOT NULL default '0',
  `name` varchar(255) NOT NULL default '',
  `min_latitude` float(10,7) NOT NULL default '0.0000000',
  `min_longitude` float(10,7) NOT NULL default '0.0000000'
  `max_latitude` float(10,7) NOT NULL default '0.0000000',
  `max_longitude` float(10,7) NOT NULL default '0.0000000'
  `coords` longblob NULL,
  `strokecolor` varchar(6) NOT NULL default '',
  `strokeweight` int(3) unsigned NOT NULL default '0',
  `strokeopacity` varchar(6) NOT NULL default '',
  `published` char(1) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
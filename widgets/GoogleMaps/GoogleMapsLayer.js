/**
 * @name Google Maps Layer for ArcGIS Server JavaScript API
 * @author: Nianwei Liu
 * @fileoverview
 * <p>Use Google Maps in application built on ESRI ArcGIS Server JavaScript API.
 *  </p>
 */
// Change log:
//2012-07-15: v2.0, update to jsapi3.0/dojo1.7, simplified.
// drop features related to sublayers for google maps, client code can do it after get reference to gmap instance.
// constructor parameter syntax changed slightly for BasemapGallery.
// streetview control is on by default.
// no xbuilt. issues with  loading the xdomain built from googlecode.com while loading jsapi from arcgisonline.
//2011-12-15: v1.07, update to jsapi2.6, oblique rotation, work with esri BasemapGallery, delayed of loading of API until set as visible
//2011-10-24: v1.05, working with basemapcontrol, styled options
//2011-10-18: v1.04, xd built
//2011-10-17: v1.03, added support for StreetView, Sub layers (Traffic, Point of Interest etc)
//2011-10-05: fixed issues with Chrome, IE7, IE8
//2011-08-11: updated for JSAPI 2.4. changed package.

//define("agsjs/layers/GoogleMapsLayer", ["dojo", "dijit", "dojox", "dojo/require","esri/dijit/BasemapGallery"], function(dojo, dijit, dojox) {

/*global dojo esri  agsjs */
/**
 * @name GoogleMapsLayerOptions
 * @class This is an object literal that specify the option to construct a {@link GoogleMapsLayer}.
 * @property {String} [id] layerId.
 * @property {Boolean} [visible] default visibility
 * @property {Number} [opacity] opacity (0-1)
 * @property {GoogleMapsAPIOptions} [apiOptions] The options to load Google API. Include property: v, client, sensor, language etc,see {@link GoogleMapsAPIOptions}
 * @property {google.maps.MapOptions} [mapOptions] optional. The options for construct Google Map instance. See <a href=http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions>MapOptions</a>.
 */
/**
 * @name GoogleMapsAPIOptions
 * @class This is an object literal that specify the option to load Google Maps API V3. See <a href=http://code.google.com/apis/maps/documentation/javascript/basics.html>Google documentation</a> for more information.
 * @property {Boolean} [sensor] whether GPS device is used. default to false;
 * @property {Number} [v] API version, 3, 3.1 etc. default to 3.
 * @property {String} [client] client ID for Google Maps Premier license.
 * @property {String} [language] language to use for text such as the names for controls, etc, e.g. cn, ja
 * @property {String} [dir] Bi-directional (Bidi) text. rtl or ltr;
 * @property {String} [libraries] Additonal libraries (geometry|places|adsense);
 *
 */
/**
 * Create a GoogleMapsLayer using config {@link GoogleMapsLayerOptions}
 * @name GoogleMapsLayer
 * @constructor
 * @class This class allows Google Maps been used in ESRI ArcGIS JavaScript API.
 * @param {GoogleMapsLayerOptions} opts
 */

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/connect',
    'dojo/query',
    'dojo/dom-construct',
    'dojo/dom-style',
    'esri/domUtils',
    'esri/layers/layer',
    'esri/layers/TileInfo',
    'esri/geometry/Extent',
    'esri/geometry/webMercatorUtils'
  ],
  function(
    declare,
    lang,
    array,
    connect,
    query,
    domConstruct,
    domStyle,
    esriDomUtils,
    Layer,
    TileInfo,
    Extent,
    webMercatorUtils) {
      var clazz = declare([Layer], {

      constructor: function(opts) {
        opts = opts || {};
        // this tileInfo does not actually do anything. It simply tricks nav control to
        // show a slider bar if only gmaps are used, which should be a rare case.
        this.tileInfo = new TileInfo({
          rows: 256,
          cols: 256,
          dpi: 96,
          origin: {
            x: -20037508.342787,
            y: 20037508.342787
          },
          spatialReference: {
            wkid: 102100
          },
          lods: [{
            level: 0,
            resolution: 156543.033928,
            scale: 591657527.591555
          }, {
            level: 1,
            resolution: 78271.5169639999,
            scale: 295828763.795777
          }, {
            level: 2,
            resolution: 39135.7584820001,
            scale: 147914381.897889
          }, {
            level: 3,
            resolution: 19567.8792409999,
            scale: 73957190.948944
          }, {
            level: 4,
            resolution: 9783.93962049996,
            scale: 36978595.474472
          }, {
            level: 5,
            resolution: 4891.96981024998,
            scale: 18489297.737236
          }, {
            level: 6,
            resolution: 2445.98490512499,
            scale: 9244648.868618
          }, {
            level: 7,
            resolution: 1222.99245256249,
            scale: 4622324.434309
          }, {
            level: 8,
            resolution: 611.49622628138,
            scale: 2311162.217155
          }, {
            level: 9,
            resolution: 305.748113140558,
            scale: 1155581.108577
          }, {
            level: 10,
            resolution: 152.874056570411,
            scale: 577790.554289
          }, {
            level: 11,
            resolution: 76.4370282850732,
            scale: 288895.277144
          }, {
            level: 12,
            resolution: 38.2185141425366,
            scale: 144447.638572
          }, {
            level: 13,
            resolution: 19.1092570712683,
            scale: 72223.819286
          }, {
            level: 14,
            resolution: 9.55462853563415,
            scale: 36111.909643
          }, {
            level: 15,
            resolution: 4.77731426794937,
            scale: 18055.954822
          }, {
            level: 16,
            resolution: 2.38865713397468,
            scale: 9027.977411
          }, {
            level: 17,
            resolution: 1.19432856685505,
            scale: 4513.988705
          }, {
            level: 18,
            resolution: 0.597164283559817,
            scale: 2256.994353
          }, {
            level: 19,
            resolution: 0.298582141647617,
            scale: 1128.497176
          }, {
            level: 20,
            resolution: 0.149291070823808,
            scale: 564.248588
          }]
        });

        this.fullExtent = new Extent({
          xmin: -20037508.34,
          ymin: -20037508.34,
          xmax: 20037508.34,
          ymax: 20037508.34,
          spatialReference: {
            wkid: 102100
          }
        });
        this.initialExtent = new Extent({
          xmin: -20037508.34,
          ymin: -20037508.34,
          xmax: 20037508.34,
          ymax: 20037508.34,
          spatialReference: {
            wkid: 102100
          }
        });
        this.opacity = opts.opacity || 1;
        this._mapOptions = opts.mapOptions || {};
        this._apiOptions = lang.mixin({
        }, opts.apiOptions || {});

        /*if (this._mapOptions.streetViewControl == undefined) {
         this._mapOptions.streetViewControl = false;
         }*/
        this._gmap = null;
        this.loaded = true;// it seems _setMap will only get called if loaded = true, so set it here first.
        this.onLoad(this);
      },

      /**
       * get the wrapped <code>google.maps.Map</code> for further customization.
       * @function
       * @name GoogleMapsLayer#getGoogleMapInstance
       * @return {google.maps.Map}
       */
      getGoogleMapInstance: function() {
        return this._gmap;
      },
      // override parent class abstract method
      /**********************
       * @see http://help.arcgis.com/en/webapi/javascript/arcgis/samples/exp_rasterlayer/javascript/RasterLayer.js
       * Internal Properties
       *
       * _map
       * _element
       * _context
       * _mapWidth
       * _mapHeight
       * _connects
       *
       **********************/
      _setMap: function(map, container) {
        // This overrides an undocumented private method from ESRI API.
        // It's possible not to do this, but it requires
        // map instance implicitly set to the layer instance, which is a little bit inconvenient.
        // this is likely called inside esriMap.addLayer()
        this._map = map;
        // this style is used to style 0 size divs, mainly for holding it's DOM position but not obstructing events.
        var style = {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '0px',
          height: '0px'
        };
        var element = domConstruct.create('div', {}, container);
        if (this.id) {
          element.id = this.id;
        }
        domStyle.set(element, style);
        this._element = element;
        var div = domConstruct.create('div', {}, element);
        domStyle.set(div, style);
        domStyle.set(div, 'width', (map.width || container.offsetWidth) + 'px');
        domStyle.set(div, 'height', (map.height || container.offsetHeight) + 'px');
        this._gmapDiv = div;

        // topDiv is used to mask all esri events in oblique mode.
        var tdiv = domConstruct.create('div', {}, map.id);
        tdiv.id = 'gmaps_top_' + div.id;
        domStyle.set(tdiv, style);
        this._topDiv = tdiv;
        // controlDiv is used to hold pegman and oblique rotater.
        var cdiv = domConstruct.create('div', {}, map.id);
        cdiv.id = 'gmaps_controls_' + div.id;
        domStyle.set(cdiv, lang.mixin(style, {
          // width: '0px',
          // height: '0px',
          top: '5px',
          left: '5px'
        }));
        this._controlDiv = cdiv;

        //this._container = layersDiv;
        // Event connections
        this._connects = [];
        this._connects.push(connect.connect(this, 'onVisibilityChange', this, this._visibilityChangeHandler));
        this._connects.push(connect.connect(this, 'onOpacityChange', this, this._opacityChangeHandler));

        this.visible = (this.visible === undefined) ? true : this.visible;
        if (this.visible) {
          this._initGMap();
        }
        return element;
      },
      _unsetMap: function(map, layersDiv) {
        // see _setMap. Undocumented method, but probably should be public.
        array.forEach(this._connects, connect.disconnect, dojo);
        if (this._streetView) {
          this._streetView.setVisible(false);
        }
        if (google && google.maps && google.maps.event) {
          if (this._gmapTypeChangeHandle)
            google.maps.event.removeListener(this._gmapTypeChangeHandle);
          if (this._svVisibleHandle)
            google.maps.event.removeListener(this._svVisibleHandle);
        }
        if (this._element)
          this._element.parentNode.removeChild(this._element);
        domConstruct.destroy(this._element);
        if (this._controlDiv)
          this._controlDiv.parentNode.removeChild(this._controlDiv);
        domConstruct.destroy(this._controlDiv);
        if (this._topDiv)
          this._topDiv.parentNode.removeChild(this._topDiv);
        domConstruct.destroy(this._topDiv);
        this._element = this._gmapDiv = this._controlDiv = null;
      },

      // delayed init and Api loading.
      _initGMap: function() {
        window.google = window.google || {}; // somehow IE needs this, otherwise complain google.maps namespace;
        if (window.google && google.maps) {
          var ext = this._map.extent;
          var center = this._mapOptions.center || this._esriPointToLatLng(ext.getCenter());
          var level = this._map.getLevel();
          var myOptions = lang.mixin({
            //disableDefaultUI: true,
            center: center,
            zoom: (level > -1) ? level : 1,
            panControl: false,
            mapTypeControl: false,
            zoomControl: false
          }, this._mapOptions);

          if (myOptions.mapTypeId) {
            myOptions.mapTypeId = this._getGMapTypeId(myOptions.mapTypeId);
          } else {
            myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
          }
          var gmap = new google.maps.Map(this._gmapDiv, myOptions);
          if (level < 0) {
            connect.connect(this._map, 'onLoad', lang.hitch(this, function() {
              this._setExtent(ext);
            }));
          }
          this._gmap = gmap;
          this._setExtent(ext);

          this._extentChangeHandle = connect.connect(this._map, 'onExtentChange', this, this._extentChangeHandler);
          this._panHandle = connect.connect(this._map, 'onPan', this, this._panHandler);
          this._resizeHandle = connect.connect(this._map, 'onResize', this, this._resizeHandler);
          // 45 deg need move up regardless of streetview
          this._mvHandle = connect.connect(this._map, 'onMouseMove', lang.hitch(this, this._moveControls));
          this._gmapTypeChangeHandle = google.maps.event.addListener(this._gmap, 'maptypeid_changed', lang.hitch(this, this._mapTypeChangeHandler));
          this._gmapTiltChangeHandle = google.maps.event.addListener(this._gmap, 'tilt_changed', lang.hitch(this, this._mapTiltChangeHandler));
          this.onLoad();
        } else if (agsjs.onGMapsApiLoad) {
          // did another instance already started loading agsjs API but not done?
          // this should be very very rare because one instance of this layer would be sufficient with setMapTypeId.
          connect.connect(agsjs, 'onGMapsApiLoad', this, this._initGMap);
        } else {
          // this is the first instance that tries to load agsjs API on-demand
          agsjs.onGMapsApiLoad = function() {
            // do nothing, just needed to dispatch event.
          };
          connect.connect(agsjs, 'onGMapsApiLoad', this, this._initGMap);
          var script = document.createElement('script');
          script.type = 'text/javascript';
          var pro = window.location.protocol;
          if (pro.toLowerCase().indexOf('http') == -1) {
            pro = 'http:';
          }
          var src = pro + '//maps.googleapis.com/maps/api/js?callback=agsjs.onGMapsApiLoad';
          for (var x in this._apiOptions) {
            if (this._apiOptions.hasOwnProperty(x)) {
              src += '&' + x + '=' + this._apiOptions[x];
            }
          }
          script.src = src;
          if (document.getElementsByTagName('head').length > 0) {
            document.getElementsByTagName('head')[0].appendChild(script);
          } else {
            document.body.appendChild(script);
          }
        }
      },

      /**
       * Sets Opacity
       * @name GoogleMapsLayer#setOpacity
       * @function
       * @param {Number} opacity from 0-1
       */
      setOpacity: function(opacity) {
        // dojo core should have something do this
        if (this._gmapDiv) {
          opacity = Math.min(Math.max(opacity, 0), 1);
          var st = this._gmapDiv.style;
          if (typeof st.opacity !== 'undefined') {
            st.opacity = opacity;
          } else if (typeof st.filters !== 'undefined') {
            st.filters.alpha.opacity = Math.floor(100 * opacity);
          } else if (typeof st.filter !== 'undefined') {
            st.filter = "alpha(opacity:" + Math.floor(opacity * 100) + ")";
          }
        }
        this.opacity = opacity;
      },
      /**
       * set map type id. e.g <code>GoogleMapsLayer.MAP_TYPE_ROADMAP</code>
       *
       * @name GoogleMapsLayer#setMapTypeId
       * @function
       * @param {String} mapTypeId one of GoogleMapsLayer.MAP_TYPE_ROADMAP|MAP_TYPE_HYBRID|MAP_TYPE_STELLITE|MAP_TYPE_TERRIAN
       */
      setMapTypeId: function(mapTypeId) {
        if (this._gmap) {
          this._gmap.setMapTypeId(this._getGMapTypeId(mapTypeId));
          this._mapTypeChangeHandler();
        } else {
          this._mapOptions.mapTypeId = mapTypeId;
        }
        return;
      },
      /**
       * set map style for customized base map. The style specs are available at <a href="http://code.google.com/apis/maps/documentation/javascript/styling.html">Google Documentation</a>.
       * This class privide a few pre-defined styles: MAP_STYLE_GRAY|MAP_STYLE_NIGHT.
       * @name GoogleMapsLayer#setMapStyle
       * @function
       * @param {Object[]} styles
       */
      setMapStyles: function(styles) {
        if (this._styleOptions) {
          // if has _styleOptions, set it null means clear it.
          styles = styles || [];
        }
        if (styles) {
          if (this._gmap) {
            this._styleOptions = styles;
            this._gmap.setOptions({
              styles: styles
            });
          } else {
            this._mapOptions.styles = styles;
          }
        }
        return;
      },
      /**
       * Fired when Google Map Type (ROAD, SATERLLITE etc) changed
       * @name GoogleMapsLayer#onMapTypeChange
       * @param {String} mapTypeId
       * @event
       */
      onMapTypeChange: function(mapTypeId) {
        // event
      },
      _getGMapTypeId: function(type) {
        // typically the constants is same, however, if google changes,
        // and API is loaded dynamically but map type is specified before API load,
        // there is a slight chance they are out of sync, so fix here.
        if (google && google.maps) {
          switch (type) {
          case'roadmap': // agsjs.layers.GoogleMapsLayer.MAP_TYPE_ROADMAP:
            return google.maps.MapTypeId.ROADMAP;
          case 'hybrid': // agsjs.layers.GoogleMapsLayer.MAP_TYPE_HYBRID:
            return google.maps.MapTypeId.HYBRID;
          case 'satellite': // agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE:
            return google.maps.MapTypeId.SATELLITE;
          case 'terrain': // agsjs.layers.GoogleMapsLayer.MAP_TYPE_TERRAIN:
            return google.maps.MapTypeId.TERRAIN;
          }
        }
        return type;
      },
      _opacityChangeHandler: function(opacity) {
        // this probably should be handled in the core ESRI API using the div returned from _setMap().
        this.setOpacity(opacity);
      },

      _visibilityChangeHandler: function(v) {
        if (v) {
          esriDomUtils.show(this._gmapDiv);
          //if (!this._svDisabled) {
          esriDomUtils.show(this._controlDiv);
          //}
          this.visible = true;
          if (this._gmap) {
            google.maps.event.trigger(this._gmap, 'resize');
            this._panHandle = this._panHandle || connect.connect(this._map, "onPan", this, this._panHandler);
            this._extentChangeHandle = this._extentChangeHandle || connect.connect(this._map, "onExtentChange", this, this._extentChangeHandler);
            this._setExtent(this._map.extent);
          } else {
            this._initGMap();
          }
        } else {
          if (this._gmapDiv) {
            esriDomUtils.hide(this._gmapDiv);
            esriDomUtils.hide(this._controlDiv);
            this.visible = false;
            if (this._gmap) {
              this._map.setExtent(this._latLngBoundsToEsriExtent(this._gmap.getBounds()));
            }
            if (this._streetView) {
              this._streetView.setVisible(false);
            }
            if (this._panHandle) {
              connect.disconnect(this._panHandle);
              this._panHandle = null;
            }
            if (this._extentChangeHandle) {
              connect.disconnect(this._extentChangeHandle);
              this._extentChangeHandle = null;
            }
          }
        }
      },
      _resizeHandler: function(extent, height, width) {
        domStyle.set(this._gmapDiv, {
          width: this._map.width + "px",
          height: this._map.height + "px"
        });
        google.maps.event.trigger(this._gmap, 'resize');
      },
      _extentChangeHandler: function(extent, delta, levelChange, lod) {
        if (levelChange) {
          this._setExtent(extent);
        } else {
          this._gmap.setCenter(this._esriPointToLatLng(extent.getCenter()));
        }
      },
      _panHandler: function(extent, delta) {
        //console.log('pan:'+extent.xmin+','+extent.ymin+','+extent.xmax+','+extent.ymax);
        if (this._gmap.getTilt() == 0) {
          this._gmap.setCenter(this._esriPointToLatLng(extent.getCenter()));
        }
      },
      _mapTypeChangeHandler: function() {
        this._checkZoomLevel();
        this.onMapTypeChange(this._gmap.getMapTypeId());
      },

      _checkZoomLevel: function() {
        var id = this._gmap.getMapTypeId();
        var types = this._gmap.mapTypes;
        var maptype = null;
        for (var x in types) {
          if (types.hasOwnProperty(x) && x == id) {
            maptype = types[x];
            break;
          }
        }
        // prevent the case when switch to terrain causing misalignment because terrain only up to level 15.
        if (maptype != null) {
          var mi = maptype.minZoom;
          var mx = maptype.maxZoom;
          var z = this._map.getLevel();
          if (mx !== undefined && z > mx) {
            this._map.setLevel(mx);
          }
          if (mi != undefined && z < mi) {
            this._map.setLevel(mi);
          }
        }
      },
      _setExtent: function(extent) {
        var ct = this._esriPointToLatLng(extent.getCenter());
        var lv = this._map.getLevel();
        /*

         if (lv >= 0) {
         this._gmap.setZoom(lv);

         } else {

         }*/
        // esrimap.getLevel is not reliable. result differnt if first layer is Bing Map vs arcgis tile layer.
        // Google maps fit always get a smaller zoom.
        this._gmap.fitBounds(this._esriExtentToLatLngBounds(extent.expand(0.5)));
        this._gmap.setCenter(ct);
        this._checkZoomLevel();

        //console.log('gmaps fit:'+this._gmap.getZoom()+' emap:'+lv);
      },
      // move the street view control on top of map container.
      // Esri API prevents mouse event progaginate to lower divs inside map container
      // this method sort of move it up so it can be dragged. A little bit hack,
      // but as long as stick to a certain version, should still be workable.
      _moveControls: function() {
        if (this._mvHandle) {
          if (!this._gmap) {
            connect.disconnect(this._mvHandle);
            this._mvHandle = null;
          } else {
            if (!this._svMoved) {
              this._streetView = this._gmap.getStreetView();
              if (this._streetView) {
                var sv = query('.gmnoprint img[src*="cb_scout_sprite"]', this._gmapDiv);
                if (sv.length > 0) {
                  array.forEach(sv, function(s, idx) {
                    domConstruct.place(s.parentNode.parentNode, this._controlDiv);
                  }, this);

                  this._svMoved = true;
                  this._svVisibleHandle = google.maps.event.addListener(this._streetView, 'visible_changed', lang.hitch(this, this._streetViewVisibilityChangeHandler));
                }
              } else {
                this._svMoved = true;
              }
            }
            if (!this._rotateMoved) {
              var ob = query('.gmnoprint img[src*="rotate"]', this._gmapDiv);
              if (ob.length > 0) {
                array.forEach(ob, function(s, idx) {
                  domConstruct.place(s.parentNode.parentNode, this._controlDiv);
                  domStyle.set(s, 'position', 'absolute');
                  domStyle.set(s, 'left', '20px');
                }, this);
                this._rotateMoved = true;
              }
            }
            if (this._rotateMoved && this._svMoved) {
              connect.disconnect(this._mvHandle);
              this._mvHandle = null;
            }
          }
        }
      },
      _streetViewVisibilityChangeHandler: function() {
        //console.log('_streetViewVisibilityChangeHandler');
        if (this._streetView) {
          var vis = this._streetView.getVisible();
          this._toggleEsriControl(vis);
          this.onStreetViewVisibilityChange(vis);
        }

      },
      // when oblique is shown, we should disable esri mouse events because the projection changes.
      _mapTiltChangeHandler: function() {
        //console.log('_mapTiltChangeHandler');
        var t = this._gmap.getTilt();
        if (t == 45) {
          //this._toggleEsriControl(true);
          //this._map._isPanGMaps = this._map.isPan;
          //this._map.disablePan();
          domConstruct.place(this._gmapDiv, this._topDiv);
          this._map.disableMapNavigation();
        } else if (t == 0) {
          //this._toggleEsriControl(false);
          //if (this._map._isPanGMaps) this._map.enablePan();
          domConstruct.place(this._gmapDiv, this._element);
          this._map.enableMapNavigation();
        }

      },
      _toggleEsriControl: function(turnOff) {
        if (turnOff) {
          this._isZoomSliderDefault = this._map.isZoomSlider;
          this._map.hideZoomSlider();
          // gmaps (as of v3.6) still dispatch events even street view is visible. so we disable it here.
          this._map.disableMapNavigation();

        } else {
          if (this._isZoomSliderDefault) {
            this._map.showZoomSlider();
          }
          this._map.enableMapNavigation();
        }
      },
      /**
       * Fired when Street View visibility changed.
       * @name GoogleMapsLayer#onStreetViewVisibilityChange
       * @param {boolean} visibility
       * @event
       */
      onStreetViewVisibilityChange: function(vis) {
        // attach events
      },
       /**
       * Fired when Street View visibility changed.
       * @name GoogleMapsLayer#onStreetViewVisibilityChange
       * @param {boolean} visibility
       * @event
       */
      onLoad: function(){

      },
      _esriPointToLatLng: function(pt) {
        var ll = webMercatorUtils.webMercatorToGeographic(pt);
        return new google.maps.LatLng(ll.y, ll.x);
      },

      _esriExtentToLatLngBounds: function(ext) {
        var llb = webMercatorUtils.webMercatorToGeographic(ext);
        return new google.maps.LatLngBounds(new google.maps.LatLng(llb.ymin, llb.xmin, true), new google.maps.LatLng(llb.ymax, llb.xmax, true));
      },

      _latLngBoundsToEsriExtent: function(bounds) {
        var ext = new Extent(bounds.getSouthWest().lng(), bounds.getSouthWest().lat(), bounds.getNorthEast().lng(), bounds.getNorthEast().lat());
        return webMercatorUtils.geographicToWebMercator(ext);
      }
    });

    lang.mixin(clazz, {
      MAP_TYPE_SATELLITE: "satellite",
      MAP_TYPE_HYBRID: "hybrid",
      MAP_TYPE_ROADMAP: "roadmap",
      MAP_TYPE_TERRAIN: "terrain",
      MAP_STYLE_GRAY: [{
        featureType: 'all',
        stylers: [{
          saturation: -80
        }, {
          lightness: 20
        }]
      }],
      MAP_STYLE_LIGHT_GRAY: [{
        featureType: 'all',
        stylers: [{
          saturation: -80
        }, {
          lightness: 60
        }]
      }],
      MAP_STYLE_NIGHT: [{
        featureType: 'all',
        stylers: [{
          invert_lightness: 'true'
        }]
      }]
    });

    return clazz;
  });

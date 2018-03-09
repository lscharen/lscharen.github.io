///////////////////////////////////////////////////////////////////////////
// Copyright © 2017 Pro-West & Associates, Inc. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/Deferred',
    'jimu/BaseWidget',
    'jimu/utils',
    'jimu/portalUtils',
    'jimu/dijit/Message',
    './GoogleMapsLayer',
    'esri/dijit/Scalebar',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/query',
    'dojo/NodeList-dom'
  ],
  function(
    declare,
    lang,
    on,
    Deferred,
    BaseWidget,
    utils,
    PortalUtils,
    Message,
    GoogleMapsLayer,
    Scalebar,
    domConstruct,
    domStyle,
    domClass,
    query) {
    var clazz = declare([BaseWidget], {
      baseClass: 'jimu-widget-google-maps',
      name: 'Google Maps',

      startup: function() {
        this.inherited(arguments);

        // Create a clickable list of maps to pick the google basemapcontrol
        var node = domConstruct.place(
          '<div class="google-maps-toggle roads-selected"></div>',
          this.domNode,
          'only'
        );

        // Stick in the global namespace
        agsjs = {};

        // Create the initial basemap
        this._setGoogleBasemap('hybrid');

        // When the user toggles the basemap, reset
        this.own(on(this.domNode, 'click', lang.hitch(this, function() {
          domClass.toggle(node, 'roads-selected');
          domClass.toggle(node, 'hybrid-selected');

          // Get the current selection and emit an event
          if (domClass.contains(node, 'roads-selected')) {
            this._setGoogleBasemap('hybrid');
          }
          else {
            this._setGoogleBasemap('roadmap');
          }
        })));
      },

      _setGoogleBasemap: function(mtype) {

        // Remove the Esri basemap, if it's a tile basemap
        var currentBasemap = this.map.getLayer(this.map.layerIds[0]);

        // Remove Esri Tiled Basemaps
        if (currentBasemap.declaredClass && currentBasemap.declaredClass.indexOf("ArcGISTiled") > -1) {
          this.map.removeLayer(currentBasemap);
        }

        // Remove our basemaps, based on id convention for now...
        if (currentBasemap.id.indexOf('google-maps-') > -1) {
          this.map.removeLayer(currentBasemap);          
        }

        var layer = new GoogleMapsLayer({
          id: 'google-maps-' + mtype,

          // Added as query parameters to the Google Maps URL
          apiOptions: {
            key: this.config.googleapikey
          },

          // Passed to the google.maps.Map contructor
          mapOptions: {
            mapTypeId: mtype
          }
        });

        this.map.addLayer(layer, 0);
      },

      onClose: function() {
      }
    });

    return clazz;
  });

import mapData from './MapData.js';
import { buildTripDescriptionHtml } from './tripDescriptionHtml';
import {
  PersonalData,
  journeyStats,
  countryFillColor,
} from './journeyModel';
import { mapColors } from './mapColors';
import { DEFAULT_VIEW, TILE_ATTRIBUTION, TILE_SUBDOMAINS, TILE_URL, WORLD_BOUNDS } from './leafletConfig';
import { LanguageContext } from '../../i18n/LanguageContext';
import React from 'react';
import L from 'leaflet';

const ALL = journeyStats.allCountries;

export default class MainMap extends React.Component {
  static contextType = LanguageContext;

  constructor (props) {
    super(props);
    this.mapRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.markers = [];
    this.zoomed = false;
    this.lastCountry = null;
    this.map = null;
    this.geoJsonLayer = null;
  }

  componentDidMount () {
    const el = this.mapRef.current;
    const description = this.descriptionRef.current;
    if (!el || !description) return;

    const map = (this.map = L.map(el, {
      zoomControl: false,
      center: [0, -1],
      zoom: 1,
      layers: [
        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTRIBUTION,
          subdomains: TILE_SUBDOMAINS,
          maxZoom: 6,
          minZoom: 2,
        }),
      ],
    }));

    const b = WORLD_BOUNDS;
    const bounds = L.latLngBounds(L.latLng(b[0][0], b[0][1]), L.latLng(b[1][0], b[1][1]));
    map.setMaxBounds(bounds);
    map.on('drag', function () {
      map.panInsideBounds(bounds, { animate: false });
    });
    map.setView(DEFAULT_VIEW.center, DEFAULT_VIEW.zoom);

    const geoJsonLayer = (this.geoJsonLayer = L.geoJson(mapData, {
      style: (feature) => ({
        fillColor: countryFillColor(feature.properties.name),
        weight: 0.1,
        opacity: 1,
        color: mapColors.stroke,
        fillOpacity: 1,
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          click: (e) => this.handleCountryClick(e, map, description),
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 1.5,
              color: mapColors.strokeHover,
              dashArray: '',
              fillOpacity: 0.7,
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
        });
      },
    }).addTo(map));

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = ['Work', 'Studies', 'Half marathon', 'Visit'];
      const colors = [mapColors.work, mapColors.studies, mapColors.halfMarathon, mapColors.visit];
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i];
        if (i !== grades.length - 1) div.innerHTML += '<br><br>';
      }
      return div;
    };
    legend.addTo(map);

    map.fitWorld();
  }

  handleCountryClick (e, map, description) {
    const country = e.target.feature.properties.name;
    if (ALL.includes(country)) {
      if (country === this.lastCountry && this.zoomed) {
        map.setView(DEFAULT_VIEW.center, 2);
        this.hideDescription(description);
        this.clearMarkers(map);
        this.zoomed = false;
      } else {
        if (country === 'Canada') {
          map.setView([55, -100], 3);
        } else {
          map.fitBounds(e.target.getBounds());
        }
        this.hideDescription(description);
        this.clearMarkers(map);
        this.addMarkersForCountry(map, country, description);
        description.style.display = 'none';
        this.lastCountry = country;
        this.zoomed = true;
      }
    } else {
      map.setView(DEFAULT_VIEW.center, 2);
      this.hideDescription(description);
      this.clearMarkers(map);
      this.zoomed = false;
    }
  }

  addMarkersForCountry (map, country, description) {
    const travels = PersonalData.travels.filter((t) => t.country === country);
    travels.forEach((obj) => {
      const m = L.marker(obj.coordinates, {
        country: obj.country,
        city: obj.city,
        description: obj.description,
        journey: obj.journey,
      })
        .addTo(map)
        .on('click', (ev) => {
          const o = ev.target.options;
          this.showDescription(description, o.country, o.city, o.description, o.journey);
        });
      this.markers.push(m);
    });
  }

  clearMarkers (map) {
    this.markers.forEach((m) => map.removeLayer(m));
    this.markers = [];
  }

  showDescription (el, country, city, textDescription, journey) {
    el.style.display = 'block';
    el.innerHTML = buildTripDescriptionHtml(country, city, textDescription, journey);
  }

  hideDescription (el) {
    el.style.display = 'none';
    el.innerHTML = '';
  }

  componentWillUnmount () {
    if (this.map) {
      this.clearMarkers(this.map);
      this.map.remove();
      this.map = null;
    }
  }

  render () {
    return (
      <section
        id="section-map"
        className="map-page-inner map-main-section"
        aria-label={this.context.t('map.mainAria')}
      >
        <div ref={this.mapRef} className="map" />
        <div
          ref={this.descriptionRef}
          id="descriptionId"
          className="description"
          style={{ display: 'none' }}
        />
      </section>
    );
  }
}

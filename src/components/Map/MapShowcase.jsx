import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { MapDemo, mapExamples } from './MapDemos';
import component from './Map.jsx?raw';
import css from './Map.css?raw';
import demos from './MapDemos.jsx?raw';

export const mapEntry = { id:'builtin-map', name:'Map', category:'Other', notes:'A quiet view of New York. Neutral cartography, generous proportions and tactile controls.' };
export function MapShowcase() {
  return <CatalogShowcase entry={mapEntry} number="33" examples={mapExamples} Demo={MapDemo} wide={['New York']}
    accessibility="One open canvas. Pan, zoom and take a closer look."
    usage="Install leaflet@1.9.4. Import Map and its sibling CSS with the existing Button and IconButton primitives. Map loads Leaflet only when mounted. Arrow keys pan the focused map; plus/minus zoom. Reset view restores the initial center and zoom. Wheel scrolling remains available to the page. Tiles require a network connection and retain provider attribution."
    usageCode={'import { Map } from \'./components/Map/Map\';\n\n<Map center={[40.7484, -73.9857]} zoom={12} label="New York map" />'}
    api={[
      ['center / zoom', 'Initial and reset view. Defaults to Midtown Manhattan, New York [40.7484, -73.9857], zoom 12.'],
      ['label', 'Accessible map region name. Defaults to New York map.'],
      ['Controls', 'Pan, zoom in/out and reset view. No markers, selections or route layers.'],
      ['Motion', 'Tactile buttons and interruptible view transitions. Reduced motion removes animated zoom and reset.'],
      ['Reference', <a href="https://leafletjs.com/examples/quick-start/" target="_blank" rel="noreferrer">Leaflet quick start — maps and tile layers (BSD-2-Clause).</a>],
      ['Basemap', <a href="https://operations.osmfoundation.org/policies/tiles/" target="_blank" rel="noreferrer">OpenStreetMap standard tiles. Follow the provider usage policy for production traffic.</a>],
    ]} sources={[[ 'Map.jsx',component ],[ 'Map.css',css ],[ 'MapDemos.jsx',demos ]]} />;
}

// MapBox accesstoken
  mapboxgl.accessToken = 'pk.eyJ1IjoicmF5bHU1MTEiLCJhIjoiY2t1d3U1djZqNTRsYzMxdDQ2N2F6aG83dCJ9.HwDwFrCLlJS_aqIbkSeYOQ';

// Create Map
const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10', 
      center: [-73.97639491735579, 40.664884375492456],
      zoom: 11.8
    });
    
    
// Fetch clinics from api 
const fetchClinics = (zipCode) => {
    //Use set for duplicate checker
    const uniqueClinics = new Set();
    const clinics = {
      "type": "FeatureCollection",
      "features": []
    };
  fetch(`https://data.cdc.gov/resource/5jp2-pgaw.json?loc_admin_zip=${zipCode}`)
  .then(res => res.json())
  .then(data => data.forEach((clinic,index) => {

      // Checks if clinic has been seen
      if (!uniqueClinics.has(clinic.loc_phone)) {
        // Extracts needed data and push to clinics array
          clinics.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [clinic.longitude, clinic.latitude]
            },
            "properties": {
                "name": clinic.loc_name,
                "phone": clinic.loc_phone,
                "address": clinic.loc_admin_street1,
                "city": clinic.loc_admin_city, 
                "postalCode": clinic.loc_admin_zip,
                "state": clinic.loc_admin_state,
                "id": index
            }
        });
        uniqueClinics.add(clinic.loc_phone);
      }
  }));
  return clinics;
}

const buildLocationList = (stores) => {
  for (const store of stores.features) {
    
    // Create listing for each store
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    listing.id = `listing-${store.properties.id}`;
    listing.className = 'border-top border-bottom border-dark';
    
    // Create link for each store
    const link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = `link-${store.properties.id}`;
    link.innerHTML = `${store.properties.name}`;
    
    // Add details
    const address = listing.appendChild(document.createElement('div'));
    address.innerHTML = `${store.properties.address} ${store.properties.city}, ${store.properties.state} ${store.properties.postalCode}`;
    const phone = listing.appendChild(document.createElement('div'));
    phone.innerHTML = ` ${store.properties.phone}`;
  }
}

const stores = fetchClinics(11220);

map.on('load', () => {
  /* Add the data to your map as a layer */
  map.addLayer({
    id: 'locations',
    type: 'circle',
    /* Add a GeoJSON source containing place coordinates and information. */
    source: {
      type: 'geojson',
      data: stores
    }
  });
  buildLocationList(stores);
});







import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import "../styles/map.css";

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnpVMayNLao-lvX0H3_rOl-MbjcKAuaCw",
  });

  const center = useMemo(() => ({ lat: 49.246292, lng: -123.116226 }), []);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track map loading state
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [infoWindowData, setInfoWindowData] = useState();
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !mapLoaded) {
      // Map has loaded, set the mapLoaded state to true
      setMapLoaded(true);
    }
  }, [isLoaded, mapLoaded]);

  useEffect(() => {
    if (mapLoaded) {
      // Fetch coffee shop data from your backend API
      const apiUrl = `http://localhost:8080/coffee-shops?lat=${center.lat}&lng=${center.lng}`;

      axios
        .get(apiUrl)
        .then((response) => {
          const coffeeShops = response.data.results;
          console.log("COFFEE SHOP DATA: ", coffeeShops);
          setCoffeeShops(coffeeShops);
        })
        .catch((error) => {
          console.log("Error fetching coffee shop data:", error);
        });
    }
  }, [mapInstance, center]);

  const handleMarkerClick = (id, lat, lng ) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id });
    console.log("infowindowdata: ", infoWindowData  );
    setIsOpen(true);
  };

  return (
    <div className="selectcontainer">
      <h1>Select Coffee Shop</h1>
      <div className="map">
        {!isLoaded ? (
          loadError ? (
            <h1>Error loading map</h1>
          ) : (
            <h1>Loading...</h1>
          )
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={13}
            mapTypeId="roadmap"
            onLoad={(map) => setMapInstance(map)}
          >
            {/* Render markers for coffee shops */}
            {coffeeShops.map((shop) => (
              <Marker
                key={shop.place_id}
                position={{
                  lat: shop.geometry.location.lat,
                  lng: shop.geometry.location.lng,
                }}
                title={shop.name}
                onClick={() => {
                  handleMarkerClick(shop.place_id, shop.geometry.location.lat, shop.geometry.location.lng);
                }}
              >
                {isOpen && infoWindowData?.id === shop.place_id && (
                  <InfoWindow
                    onCloseClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <h3>{shop.name}</h3>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import "../styles/map.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import mapstyles from "../styles/mapstyles";

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

  const handleMarkerClick = (id, lat, lng) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id });
    console.log("infowindowdata: ", infoWindowData);
    setIsOpen(true);
  };
  
  const handleMapClick = () => {
    setIsOpen(false);
  }

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
            onClick={{ handleMapClick }}
            center={center}
            zoom={13}
            // mapTypeId="styled_map"
            onLoad={(map) => setMapInstance(map)}
            mapId="4e6f57430e492946"
            options={{ styles: mapstyles }}
          >
            {/* Render markers for coffee shops */}
            {coffeeShops.map((shop) => (
              <Marker
                icon={"http://maps.google.com/mapfiles/kml/pal2/icon54.png"}
                key={shop.place_id}
                position={{
                  lat: shop.geometry.location.lat,
                  lng: shop.geometry.location.lng,
                }}
                title={shop.name}
                onClick={() => {
                  handleMarkerClick(
                    shop.place_id,
                    shop.geometry.location.lat,
                    shop.geometry.location.lng
                  );
                }}
              >
                {isOpen && infoWindowData?.id === shop.place_id && (
                  <InfoWindow
                    onCloseClick={() => {
                      setIsOpen(false);
                    }}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <h2>{shop.name}</h2>
                      <a href="#">
                        <h4>Click Here to Order</h4>
                      </a>
                    </div>
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

import { GoogleMap, Marker, useLoadScript, InfoWindow} from "@react-google-maps/api";
import { useMemo, useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../styles/map.module.css";
import mapstyles from "../styles/mapstyles";
import { currentStoreContext } from "../App";

const googleMapsApiKey = process.env.REACT_APP_GOOG_API;

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const center = useMemo(() => ({ lat: 49.263805, lng: -122.882565 }), []);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track map loading state
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [infoWindowData, setInfoWindowData] = useState();
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStore, setCurrentStore] = useContext(currentStoreContext);

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
          setCoffeeShops(coffeeShops);
        })
        .catch((error) => {
          console.log("Error fetching coffee shop data:", error);
        });
    }
  }, [mapInstance, center, mapLoaded]);

  const handleMarkerClick = (id, lat, lng) => {
    mapRef?.panTo({ lat, lng });
    setIsOpen(true);
    setInfoWindowData({ id });
  };

  const handleMapClick = () => {
    setIsOpen(false);
  };

  const handleOrderHereClick = async (shopName, shopAddress, place_id, id) => {
    const shopData = await verifyShopRegistration(place_id);
    if (shopData.isRegistered) {
      setCurrentStore({ Name: shopName, Address: shopAddress, placeId: place_id, id: shopData.id });
    } else {
      alert("This coffee shop is not available for orders yet.");
    }
  };

const verifyShopRegistration = async (place_id) => {
  try {
    const response = await axios.get(`http://localhost:8080/checkRegisteredShop?place_id=${place_id}`);
    return response.data; 
  } catch (error) {
    console.error("Error verifying shop registration:", error);
    return false;
  }
};


  return (
    <div className={styles.selectContainer}>
      <h1>Select Coffee Shop</h1>
      <div className={styles.map}>
        {!isLoaded ? (
          loadError ? (
            <h1>Error loading map</h1>
          ) : (
            <h1>Loading...</h1>
          )
        ) : (
          <GoogleMap
            mapContainerClassName={styles.mapContainer}
            onClick={() => handleMapClick()}
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
                      <h3>{shop.vicinity}</h3>
                      <Link
                        to="/Products"
                        onClick={() =>
                          handleOrderHereClick(shop.name, shop.vicinity, shop.place_id)
                        }
                      >
                        Click Here to Order
                      </Link>
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

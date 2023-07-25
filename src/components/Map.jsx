import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "../styles/map.css";

export default function Map() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnpVMayNLao-lvX0H3_rOl-MbjcKAuaCw",
  });
  const center = useMemo(() => ({ lat: 49.246292, lng: -123.116226 }), []);

  return (
    <div className="map">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={15}
        >
          <Marker position={{ lat: 49.246292, lng: -123.116226 }} />
        </GoogleMap>
      )}
    </div>
  );
};



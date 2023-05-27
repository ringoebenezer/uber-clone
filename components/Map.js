import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import { selectOrigin, selectDestination } from "../slices/navSlice";
import { useSelector } from "react-redux";
import tw from "twrnc";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { selectTravelTimeInformation } from "../slices/navSlice";

export default function Map() {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then(res => res.json())
        .then(data => {
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        });
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      initialRegion={{
        latitude: 37.78825,
        // latitude: origin.location.lat,
        longitude: -122.4324,
        // longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}>
      {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
        />
      )}
      {/* origin?.location &&  */}
      {true && (
        <Marker
          coordinate={{
            latitude: 37.78825,
            // latitude: origin.location.lat,
            longitude: -122.4324,
            // longitude: origin.location.lng,
          }}
          title="Origin"
          //   description={origin.description}
          description={"This is fun"}
          identifier="origin"
        />
      )}
      {/* destination?.location &&   */}
      {true && (
        <Marker
          coordinate={{
            latitude: 37.78825,
            // latitude: destination.location.lat,
            longitude: -122.4324,
            // longitude: destination.location.lng,
          }}
          title="Destination"
          //   description={destination.description}
          description={"This is fun"}
          identifier="destination"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({});

import React, { useState } from "react";
import ReactGlobe from "react-globe";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import CoordinatesModal from "./components/coordinatesModal";

function App() {
  const [userCoordinates, set_userCoordinates] = useState([0, 0]);
  const [resetglobe, set_resetglobe] = useState(true);
  const [loadingSat, set_loadingSat] = useState(true);
  const [coordinatesEdit, set_coordinatesEdit] = useState({});
  const [globeloaded, set_globeloaded] = useState(false);
  const defaultMarker =  {
    id: "marker1",
    sign: "Your Coordinates",
    color: "blue",
    coordinates: userCoordinates,
    value: `0`,
  }
  const [markers, set_markers] = useState([defaultMarker]);


  React.useEffect(() => {
    callStarlinkAPI();
    set_markers([defaultMarker]);
  }, [userCoordinates]);

  const callStarlinkAPI = () => {
    set_loadingSat(true)
    let options = {
      originLatitude: userCoordinates[0],
      originLongitude: userCoordinates[1],
      number: coordinatesEdit.number || 10,
    }
    
    let formBody = [];
    for (let property in options) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(options[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("https://starlinksatellitesrails.herokuapp.com/", {
      method: "post",
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          set_loadingSat(false)
          let satellites = result.map(sat=>sat.table)
          satellites = satellites.map((sat, i) => {
            return {...sat, 
              sign: `Satellite ${i}`,
              color: "gray",
              coordinates: [sat.latitude, sat.longitude],
              id: `sat${i}`,
              value: sat.distanceWithOrigin,
            }
          })

          set_coordinatesEdit({})
          set_markers([defaultMarker, ...satellites])
        },
        (error) => {
          set_loadingSat(false)
          console.log(error);
        }
      );
  };

  React.useEffect(() => {
    set_resetglobe(true);
  }, [resetglobe]);

  React.useEffect(() => {
    set_resetglobe(false);
  }, [userCoordinates]);

  const options = {
    ambientLightColor: "red",
    cameraRotateSpeed: 0.5,
    focusAnimationDuration: 2000,
    focusEasingFunction: ["Linear", "None"],
    pointLightColor: "gold",
    pointLightIntensity: 1.5,
    globeGlowColor: "blue",
    markerTooltipRenderer: (marker) => `${marker.sign} (${marker.value})`,
  };

  return (
    <div className="main">
      <CoordinatesModal
        globeloaded={globeloaded}
        set_coordinates={set_userCoordinates}
        set_coordinatesEdit={set_coordinatesEdit}
        coordinatesEdit={coordinatesEdit}
        set_globeloaded={set_globeloaded}
      />
      {loadingSat && <p className={"loading"}>Loading Satellites</p>}
      {!globeloaded && <p className={"loading"}>Loading textures</p>}
      <div>
        {resetglobe && (
          <ReactGlobe
            height="90vh"
            initialCoordinates={userCoordinates}
            markers={markers}
            options={options}
            onGlobeTextureLoaded={() => set_globeloaded(true)}
            width="100%"
          />
        )}
      </div>
    </div>
  );
}

export default App;

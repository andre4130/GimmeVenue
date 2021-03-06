import React, { useState, useContext, useEffect, useRef } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import useSupercluster from "use-supercluster";


//components
import CitySelection from '../../components/CitySelection/CitySelection'
import FilterBox from '../../components/FilterBox/FilterBox';
import CheckCity from '../../components/CitySelection/CheckCity';
// import Login from '../../components/Auth/Login';
// import Register from '../../components/Auth/Register';

//data 
import genres from '../../data/genres.json'
import venues from '../../data/venues.json'
import MyCalendar from '../../components/Calendar/Calendar';


function BarcelonaMapGl({ mapboxApiAccessToken, selectedCity, latitude, longitude, handleSelectCity }) {

    const [viewPort, setViewPort] = useState({
        latitude: 41.386991,
        longitude: 2.169987,
        zoom: 13,
        width: "100vw",
        height: "95vh"
    })

    //setting the genre filter state function
    const [state, setChecked] = useState({
        checkbox: genres
    })

    const [stateVenue, setVenue] = useState({
        stateVenues: venues
    })

    const handleCheckboxChange = e => {

        setChecked({
            checkbox: state.checkbox.map(genre => {

                return (e.target.value !== genre.genre) ?
                    genre : { ...genre, checked: !genre.checked }
            })
        })

        //hides and shows the venues according to the ticked checkboxes

        setVenue({
            stateVenues: stateVenue.stateVenues.map(venue => {
                var counter = venue.genre.length;
                for (let i = 0; i < state.checkbox.length; i++) {
                    if ((state.checkbox[i].checked) === false && venue.genre.includes(state.checkbox[i].genre)) {
                        counter = counter - 1
                        // console.log("the genre", state.checkbox[i].genre, "is not checked and included in the venue", venue.name ,". the counter is reduced to:", counter)
                    } else {
                        // console.log("nothing happens")
                    }
                }
                if (counter === 0) {
                    console.log("counter = 0", venue)
                    return { ...venue, isVisible: false }
                } else {
                    console.log("counter no 0", counter)
                    return { ...venue, isVisible: true }
                }
            })
        })
    };

    const handleFavorite = e => {
        setVenue({
         stateVenues: {...venues, isFavorite: true}
        })
    }
    //useEffect in order to avoid the delay of the checkbox selector
    useEffect(() => {
        setVenue(stateVenue)
    }, [stateVenue, state]) //this array dependency only runs when any of these dependencies changes. if the array is empty, it only runs on "mount"

    const handleSelectAll = e => {
        //select all and clear all buttons
        if (e.target.value === "Select All") {
            setChecked({
                checkbox: state.checkbox.map(genre => {
                    return { ...genre, checked: true }
                })
            })
        } else {
            setChecked({
                checkbox: state.checkbox.map(genre => {
                    return { ...genre, checked: false }
                })
            })
        }
        //hiding and showing the locations    
        if (e.target.value === "Select All") {
            setVenue({
                stateVenues: stateVenue.stateVenues.map(venue => {
                    return { ...venue, isVisible: true }
                })
            })
        } else {
            setVenue({
                stateVenues: stateVenue.stateVenues.map(venue => {
                    return { ...venue, isVisible: false, counter: 0 }
                })
            })
        }

    }

    //using the escape key to close the popup
    const [selectedVenue, setSelectedVenue] = useState(null);

    useEffect(() => {
        const listener = e => {
            if (e.key === "Escape") {
                setSelectedVenue(null)
            }
        };
        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener)
        }
    }, []);


    const mapRef = useRef();

    //Generating a Supercluster of venues ==> currently not working


    //Load and prepare the data
    const points = venues.map(venue => ({
        type: "Feature",
        id: venue.id,
        properties: { cluster: false, venueID: venue.id, category: venue.className },
        geometry: { type: "Point", coordinates: [venue.position[0], venue.position[1]] },
    }));

    //get the bounds 

    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    //generating the cluster

    const { clusters } = useSupercluster({
        points,
        zoom: viewPort.zoom,
        bounds,
        options: { radius: 75, maxZoom: 20, minZoom: 0 }
    });

    //markers code Leigh
    const venuesMarker = stateVenue.stateVenues.map(venue =>
        <Marker
            key={venue.id}
            latitude={venue.position[0]}
            longitude={venue.position[1]}
        >
            <div className={venue.isVisible ? "show" : "hide"}>
                {venue.name}
                <br />
                <div className={venue.className}
                    onClick={(e) => {
                        e.preventDefault()
                        setSelectedVenue(venue)
                    }}
                >
                </div>
            </div>
        </Marker>
    )

    return (
        <div>
            <ReactMapGL
                {...viewPort}
                mapboxApiAccessToken={mapboxApiAccessToken.token[0].token}
                mapStyle="mapbox://styles/andre4130/ckcnjsgto2nrb1inpf706l90s"
                onViewportChange={viewport => {
                    setViewPort(viewport);
                }}
                onClick={() => setSelectedVenue(null)}
                ref={mapRef}
            >
                {venuesMarker}
                {selectedVenue ? (
                    <Popup
                        className="popup"
                        latitude={selectedVenue.position[0]}
                        longitude={selectedVenue.position[1]}
                        // onClose={() => setSelectedVenue(null)}
                    >
                        <h2>{selectedVenue.name}</h2>
                        <div>
                            <h5>Address</h5>
                            <p>{selectedVenue.address}</p>
                        </div>
                        <div>
                            <h5>Genres</h5>
                            <ul className="list-group list-group-horizontal">{selectedVenue.genre.map(genre =>
                                <li className="list-group-item">{genre}</li>
                            )}</ul>
                        </div>
                        <div>
                            <h5>Agenda</h5>
                            <MyCalendar/>
                        </div>
                        <div className="venue-favorite">
                        <label>
                Mark as Favourite
            </label>
                        <input
                className='checkbox'
                // value={this.genre.favorite}
                name="Genre"
                type="checkbox"
                onChange={handleFavorite}
            >
            </input>
                        </div>
                    </Popup>
                ) : null}
                <FilterBox
                    selectedCity={selectedCity}
                    latitude={latitude}
                    longitude={longitude}
                    onChange={(e) => handleCheckboxChange(e)}
                    onClick={(e) => handleSelectAll(e)}
                    state={state}
                    viewport={viewPort}
                />
                <CheckCity
                    selectedCity={selectedCity}
                    latitude={latitude}
                    longitude={longitude}
                    setViewPort={setViewPort}
                    viewPort={viewPort}
                    handleSelectCity={handleSelectCity}
                />
            </ReactMapGL>
        </div>

    )
}

export default BarcelonaMapGl

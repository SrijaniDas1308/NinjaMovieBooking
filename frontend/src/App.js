import axios from "axios";
import "./styles/App.css";
import "./styles/bootstrap.min.css";
import React, { useState } from "react";
import { movies, slots, seats } from "./data";


const App = () => {
    // Set initial state for bookingData using data from local storage, or default values if local storage is empty
    const [bookingData, setBookingData] = useState(() => {
      const storedData = JSON.parse(localStorage.getItem("Object"));
      if (storedData) {
        return storedData;
      } else {
        return {
          movie: "",
          slot: "",
          seats: { A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 },
        };
      }
    });
  
  const [selectedMovie, setSelectedMovie] = useState(() => {
    const storedMovie = localStorage.getItem("selectedMovieName");
    return storedMovie ? storedMovie : null;
  });
  // Set initial state for selectedTime using data from local storage, or null if local storage is empty
  const [selectedTime, setSelectedTime] = useState(() => {
    const storedTime = localStorage.getItem("selectedTimeSlot");
    return storedTime ? storedTime : null;
  });
  
  // Set initial state for loading to true
  const [loading, setLoading] = useState(true);

  // handle input changes for seat selections
  function seatObjHandler(e) {
    const { name, value } = e.target;
    // update bookingData state with new seat selection values
    setBookingData((prev) => {
      return { ...prev, seats: { ...prev.seats, [name]: value } };
    });
  }
  function movieAndTimeValuesHandler(e) {
    const { name, value } = e.target;
    // update bookingData state with new values
    setBookingData((prev) => {
      return { ...prev, [name]: value };
    });
    // update selectedMovie or selectedTime state based on the input name
    if (name === "movie") {
      setSelectedMovie(value);
    }
    if (name === "slot") {
      setSelectedTime(value);
    }
  }
  
    // handle form submission
    async function submitDetails() {
      setLoading(true);
      // send a POST request to the server with booking data
      await axios
        .post("http://localhost:8080/api/booking", bookingData)
        .then((res) => {
          // update lastBooking state with response data
          setLoading(false);
          alert("Booking Successfull");
        })
        .catch((err) => {
          if (err.response.status === 422) {
            setLoading(false);
            alert(err.response.data);
          } else {
            console.log(err.result);
            setLoading(false);
          }
        });
      // reset state variables to initial values after form submission
      setBookingData({
        movie: "",
        slot: "",
        seats: { A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 },
      });
      setSelectedMovie(null);
      setSelectedTime(null);
    }
    async function lastBookingDetails() {
      setLoading(true);
      // api call to get last booking details
      await axios
        .get("http://localhost:8080/api/booking")
        .then((res) => {
          setLastBooking(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    // call lastBookingDetails function on component mount
    useEffect(() => {
      lastBookingDetails();
    }, []);
  
    // api call to delete previous bookings
    async function deletePreviousBookings() {
      setLoading(true);
      await axios
        .delete("http://localhost:8080/api/booking")
        .then((res) => {
          alert(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      // call lastBookingDetails function after deleting previous bookings
      lastBookingDetails();
    }
  return (
    <div className="d-flex">
      {/* Booking Form */}
      <div className="container" style={{ width: "70%" }}>
        {/* Movie selection */}
        <div className="movie-row">
          <h4>Select a Movie</h4>
          {movies.map((item, index) => (
            <button
              key={index}
              className={`btn movie-column ${
                selectedMovie === item ? "bg-info text-light" : "bg-light"
              }`}
              name="movie"
              value={item}
              onClick={movieAndTimeValuesHandler}
            >
              {item}
            </button>
          ))}
        </div>
        {/* Time slot selection */}
        
        <div className="slot-row">
          <h4>Select a Time Slot</h4>
          {slots.map((item, index) => (
            <button
              key={index}
              className={`btn slot-column ${
                selectedTime === item ? "bg-info text-light" : "bg-light"
              }`}
              name="slot"
              value={item}
              onClick={movieAndTimeValuesHandler}
            >
              {item}
            </button>
          ))}
        </div>
        {/* Seat selection */}
        <div className="seat-row">
          <h4>Select the Seats</h4>
          {seats.map((item, index) => (
            <div key={index} className="btn btn-light seat-column">
              <h6>{item}</h6>
              <input
                name={item}
                onChange={seatObjHandler}
                type="number"
                min="0"
                max="10"
                value={bookingData.seats[item]}
              />
            </div>
          ))}
        </div>
        {/* Booking button */}
        <div className="book-button">
          <hr />
          {loading ? (
            <h5>Please wait</h5>
          ) : (
            <button onClick={submitDetails}>Book Now</button>
            )}
          </div>
        </div>
        {/* Display Last Booking Details */}
        <div className="container w-25 ">
          <h4 className="text-center pb-3">Last Booking Details:</h4>
          {loading ? (
            <div className="d-flex align-items-center">
              <div
                className="spinner-border ml-auto"
                role="status"
                aria-hidden="true"
              ></div>
            </div>
          ) : (
            <div>
              {lastBooking ? (
                <>
                  <div
                    className="ticket border rounded px-3 py-3 bg-light font-italic"
                    style={{ flexDirection: "column" }}
                  >
                    <p>
                      Movie Name : <span>{lastBooking.movie}</span>
                    </p>
                    <p>
                      Time-Slot : <span>{lastBooking.slot}</span>
                    </p>
                    <p>
                      Seats :
                      {Object.entries(lastBooking.seats).map(
                        // eslint-disable-next-line array-callback-return
                        ([key, value], index, array) => {
                          if (value >= 1) {
                            return (
                              <span key={key}>
                                {index >= 2 &&
                                  index !== array.length - 1 &&
                                  " | "}{" "}
                                {key} : {value}
                                {index !== array.length - 1 && " | "}
                              </span>
                            );
                          }
                        }
                      )}
                    </p>
                  </div>
                  <hr />
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    onClick={deletePreviousBookings}
                  >
                    Delete Previous Bookings
                  </button>
                </>
              ) : (
                <div
                  className="ticket border rounded px-3 py-3 bg-light font-italic"
                  style={{ flexDirection: "column" }}
                >
                  <p className="text-danger text-center">
                    <strong>No Previous Booking Found!</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  export default App;
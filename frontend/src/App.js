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
        .post("https://book-a-movie-backend.vercel.app/api/booking", bookingData)
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
    </div>
  )
}

export default App

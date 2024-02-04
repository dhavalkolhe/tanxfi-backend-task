import dotenv from "dotenv";
import io from "socket.io-client";
import axios from "axios";

dotenv.config();

let userToken = "";

const socket = io(`http://localhost:${process.env.PORT}`, {
  auth: {
    token: userToken,
  },
});

socket.on("connect", async () => {
  console.log("Connected to server");

  try {
    const response = await axios.get(
      `http://localhost:${process.env.PORT}/alerts`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Extract unique currencies from the response
    const uniqueCurrencies = [
      ...new Set(response.data.alerts.map((alert) => alert.currency)),
    ];

    // Subscribe to alerts for each unique currency
    uniqueCurrencies.forEach((currency) => {
      socket.emit("subscribe", currency);
    });

    // Handle alert events
    socket.on("alert", (data) => {
      console.log("ALERT RECIEVED:", data.message);
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

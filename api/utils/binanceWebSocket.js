import WebSocket from "ws";
import Alert from "../models/alertModel.js";
import User from "../models/userModel.js";

const startWebSocket = (io) => {
  const currencySockets = new Map();

  const connectToBinanceWebSocket = (currency) => {
    console.log("NEW SOCKET CONNECTION FOR Currency: ", currency);
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${currency.toLowerCase()}usdt@trade`
    );

    ws.on("message", async (data) => {
      const priceData = JSON.parse(data);
      const currentPrice = parseFloat(priceData.p);
      console.log("Currency: ", currency, "Current Price: ", currentPrice);

      try {
        const alerts = await Alert.find({
          status: "created",
          currency: currency,
        });

        alerts.forEach(async (alert) => {
          const targetPrice = parseFloat(alert.price);

          //for easy visulization of triggered target, range is kept at 50
          if (Math.abs(currentPrice - targetPrice) <= 50) {
            await Alert.findByIdAndUpdate(alert._id, {
              status: "triggered",
              triggered_at: new Date(),
            });

            io.emit("alert", {
              message: `Alert triggered for ${alert.currency} at ${currentPrice}`,
            });
          }
        });
      } catch (error) {
        console.error(`Error checking alerts for ${currency}:`, error);
      }
    });

    return ws;
  };

  const updateUserSocket = async (userId, currency) => {
    try {
      const user = await User.findById(userId);

      if (user) {
        const existingSocket = currencySockets.get(currency);

        if (existingSocket) {
          // Socket already exists, update the user's socket reference
          user.sockets[currency] = existingSocket;
        } else {
          // Socket doesn't exist, create a new socket
          const newSocket = connectToBinanceWebSocket(currency);
          user.sockets[currency] = newSocket;
          currencySockets.set(currency, newSocket);
        }

        await user.save();
      }
    } catch (error) {
      console.error(`Error updating user socket for ${currency}:`, error);
    }
  };

  io.on("connection", async (socket) => {
    console.log("A user connected");

    const userId = socket.request.user.userId;

    try {
      const user = await User.findById(userId).populate("alerts", "currency");

      if (user) {
        // Subscribe to rooms for each currency the user has alerts for
        user.alerts.forEach((alert) => {
          const currency = alert.currency;
          socket.join(currency);
          updateUserSocket(userId, currency);
        });
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }

    socket.on("disconnect", async () => {
      console.log("User disconnected");

      const userId = socket.request.user.userId;

      try {
        const user = await User.findById(userId);

        if (user) {
          // Disconnect and delete sockets on user disconnect
          for (const currency in user.sockets) {
            const socket = user.sockets[currency];
            if (socket) {
              socket.close();
            }
          }

          // Clear user's sockets
          user.sockets = {};
          await user.save();
        }
      } catch (error) {
        console.error("Error handling user disconnect:", error);
      }
    });
  });
};

export default startWebSocket;

# Real-time Alert System with WebSocket Integration

This project implements a real-time alert system where users can set price alerts for different crypto currencies and receive instant updates when the target price is reached. The application uses WebSocket connections to Binance for real-time price updates.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm:** Make sure you have Node.js and npm (Node Package Manager) installed. You can download them from [https://nodejs.org/](https://nodejs.org/).

- **WebSocket Support:** Ensure that your environment supports WebSocket connections. If you are behind a firewall, make sure to allow WebSocket connections.

- **MongoDB**
- **A Good IDE**

## Installation

Follow these steps to set up and run the project locally:

1. Open your terminal.

2. Clone the repository:
   ```bash
   git clone https://github.com/dhavalkolhe/tanxfi-backend-task.git
   ```
3. Install dependencies:
   ```bash
   cd tanxfi-backend-task
   npm install
   ```
4. Create a .env file in the root of your project with the following content:

```bash
    PORT={Specify port number}
    MONGODB_URL=mongodb+srv://dhavalkolhe02:ZaVZ7x0SMQ19Y15C@cluster0.x3gioli.mongodb.net/tanxFi_Dev?retryWrites=true&w=majority
    JWT_SECRET_KEY=THISISASECRETKEYFORtanxfiTASKBYdhaval
    JWT_EXPIRATION=7d
    BINANCE_API_KEY={}
    BINANCE_API_SECRET={}

```

## Run Project

```bash
    node index.js
```

The backend for project is now successfully running. Time to explore the api collection and play around with alerts.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/18300451-0bc01249-d42c-42dc-8bea-9de783b1ba21?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D18300451-0bc01249-d42c-42dc-8bea-9de783b1ba21%26entityType%3Dcollection%26workspaceId%3D0cda4b23-bf2c-4ec7-8c79-5c52481961a6)

Use this `Postman Collection` to perform the following actions.

```bash
    1. SignUp and Login Users
    2. Create and Delete Alerts
    3. Retrieve all alerts of a specific user (Filtering, Pagination)
    4. Activate all the registered alerts of a user
```

Flow of Tasks to be peformed:

1. Sign Up the user at `/auth/signup`
2. Login User using `/auth/login`. On successful login, you will recieve a `token` in response. Copy that token,, keep it with you somewhere for future use, then add it to `Environment -> TanxFi Dev` with the following values.

```bash
    variable = token
    type = secret
    initial value = {Paste Copied token}
    current value = {Paste Copied token}
```

3.  Now you are eligible to test the other end points.

    Start by creating an Alert using `/alerts/create`

    Try deleting it by using `/alerts/delete`

    Try Retreiving all the alerts of an user using `/alerts`, You can filter using several optional parameters such as:

         status: triggered || created || failed
         limit: any (default 5)
         page: any (default 1)

4.  Once you are satisfied with all the alerts that yyou've created for different currencies at different prices, Now its time to activate these alerts. Hit `/activateAlerts` to activate all the registered alerts by the user.

5.  Time to activate our Client and wait for trigger alert to appear.

```bash
Note: The range of trigger is kept at +-50$ for easy visualization purpose, since cryptocurrencies fluctuate heavily so probablity of our target price being hit is significantly low.
```

Open `client/client.js` file and paste the earlier copied auth token in place of `YOUR_AUTH_TOKEN`

Go back to your terminal and execute

```bash
    node client/client.js
```

`You should be able to see the current market price of currencies that you created alerts for in your server side logs whereas the trigger will reflect in client logs.: `

## Alerts Triggering using web socket Explained
## Overview

This logic is implemented in a server-side script to handle WebSocket connections and real-time alerts for a user's specified currencies.

## Functions

1. **`connectToBinanceWebSocket(currency)`**

   - Establishes a WebSocket connection with Binance for a specific currency.
   - Listens for trade messages for that currency and logs the current price.
   - Checks if the current price triggers any user alerts and emits an alert message to connected clients if triggered.

2. **`updateUserSocket(userId, currency)`**

   - Updates the user's socket information based on the currency.
   - If a WebSocket for the currency already exists, updates the user's socket reference.
   - If not, creates a new WebSocket connection for the currency.

3. **`io.on("connection", socket)`**
   - Triggered when a user connects to the server via WebSocket.
   - Fetches user information and their subscribed alert currencies.
   - Subscribes the socket to rooms for each currency and updates the user's socket information.
   - Listens for disconnection events and closes the corresponding WebSocket connections.

## Example Use Case

1. **User Connection:**

   - When a user connects, their user information is fetched.
   - For each currency they have subscribed alerts for, a WebSocket connection is established.

2. **Real-time Trade Data:**

   - The WebSocket listens for real-time trade data from Binance.
   - If the trade data triggers any alerts for the user, an alert message is emitted to connected clients.

3. **User Disconnection:**
   - When a user disconnects, their WebSocket connections for subscribed currencies are closed.
   - User's socket information is updated and cleared.

## Notes

- The logic uses Binance WebSocket to get real-time trade data for specified currency pairs.
- It emits alert messages to connected clients when the trade data triggers user alerts.
- WebSocket connections are managed for each user based on their subscribed currencies.

**Important:** Ensure proper error handling and security measures in a production environment.

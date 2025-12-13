import express from "express";
import cors from "cors";
import pool from "./db.js";

import usersRoutes from "./routes/users.js";
import agentsRoutes from "./routes/agents.js";
import rentersRoutes from "./routes/renters.js";
import addressesRoutes from "./routes/addresses.js";
import propertiesRoutes from "./routes/properties.js";
import bookingsRoutes from "./routes/bookings.js";
import creditCardsRoutes from "./routes/creditcards.js";
import lookRoutes from "./routes/look.js";

const app = express();
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/users", usersRoutes);
app.use("/agents", agentsRoutes);
app.use("/renters", rentersRoutes);
app.use("/addresses", addressesRoutes);
app.use("/properties", propertiesRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/creditcards", creditCardsRoutes);
app.use("/look", lookRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
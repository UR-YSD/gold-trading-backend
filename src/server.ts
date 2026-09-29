import app from "./app";
import { sequelize } from "./models";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync models with database to create/update tables automatically
    await sequelize.sync({ alter: true });
    console.log("Database tables synced successfully.");

    app.listen(PORT, () => {
      console.log(`Gold Trading API is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
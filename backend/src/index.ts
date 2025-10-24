import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import classificationRoutes from "./routes/classification.routes";
import { ResponseHandler } from "./utils/response";
import { 
  corsMiddleware, 
  jsonMiddleware, 
  errorHandler, 
  notFoundHandler
} from "./middleware";
import { API_CONFIG } from "./constants";

dotenv.config();

const app = express();
const port = process.env.PORT || API_CONFIG.DEFAULT_PORT;

app.use(corsMiddleware);
app.use(jsonMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/classify", classificationRoutes);

// Root endpoint
app.get("/", (req, res) => {
    ResponseHandler.success(res, {
        message: "Email Classification API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            auth: "/api/auth",
            emails: "/api/emails",
            classification: "/api/classify"
        }
    }, "Welcome to Email Classification API");
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
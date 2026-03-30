import {connectDB} from './src/config/database';
import app from "./src/app";

const PORT = process.env.PORT || 3000;


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port PORT:", PORT);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});
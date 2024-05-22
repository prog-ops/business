import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import FileUpload from "express-fileupload"
import ProdukRoute from "./route/ProdukRoute.js";

const app = express();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())
app.use(FileUpload())
app.use(express.static("public"))
app.use(ProdukRoute)

app.listen(port, () => {
    console.log('Server listening on port 3001');
});

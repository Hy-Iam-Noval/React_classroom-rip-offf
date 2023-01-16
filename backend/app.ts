import express from "express";
import expressSession from "express-session";
import bodyParser from "body-parser";
import router from "./src/router";
import { flash } from "express-flash-message";
import fileUpload from "express-fileupload";
import cors from "cors";

export const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
   expressSession({
      secret: "ndnainiamdnwd",
      saveUninitialized:false,
      resave: false,
   })
);
app.use(fileUpload({ parseNested: true }));
app.use(
   cors({
      optionsSuccessStatus: 200,
      methods: "POST, GET, DELETE",
      origin(requestOrigin, callback) {
         /localhost:3000/.test(requestOrigin) ? callback(null, true) : callback(null, false);
      },
   })
);
app.use(flash({ sessionKeyName: "flash" }));

app.use(router);

app.listen(5000, () => console.log("ruun"));

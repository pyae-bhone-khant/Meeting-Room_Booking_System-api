import app from "./app.js";
import config from "../src/config/index.js";

app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});

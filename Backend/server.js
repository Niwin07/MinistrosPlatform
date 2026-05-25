require("dotenv").config(); // ← agregar esto

const app = require("./src/app");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API corriendo en :${port}`);
});

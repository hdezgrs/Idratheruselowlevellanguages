const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "propositos",
  password: "janemba",
  port: 5432,
});

pool.connect((err, cliente, release) => {
  if (err) {
    return console.error("Error adquiriendo cliente", err.stack);
  }
  console.log("Conexión exitosa con la base de datos");
  cliente.release();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/misPropositos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM MisPropositos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener sus propósitos" });
  }
});

app.post("/misPropositos", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO MisPropositos (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crearlo" });
  }
});

app.put("/misPropositos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE MisPropositos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion, id],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se ha encontrado lo que desea modificar" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar" });
  }
});

app.delete("/misPropositos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM MisPropositos WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }
    res.json({ message: "Eliminada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

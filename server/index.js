const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware 
app.use(cors());
app.use(express.json());

/**ROUTES**/

//create new link
app.post("/links", async (req, res) => {
    try {
        const { name, url } = req.body;
        const newLink = await pool.query(
            "INSERT INTO links (name, URL) VALUES($1, $2) RETURNING *",
            [name, url]
        );

        res.json(newLink.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all links

app.get("/links", async (req, res) => {
    try {
        const allLinks = await pool.query("SELECT * FROM links");
        res.json(allLinks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a links

app.get("/links/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const link = await pool.query("SELECT * FROM links WHERE ID = $1", [
            id
        ]);

        res.json(link.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a links

app.put("/links/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url } = req.body; 
        const updateTodo = await pool.query(
            "UPDATE links SET name = $1, URL = $2 WHERE ID = $3",
            [name, url, id]
        );

        res.json("Link was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a link

app.delete("/links/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteLinks = await pool.query("DELETE FROM links WHERE ID = $1", [
            id
        ]);
        res.json("Link was deleted!");
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(8000, () => {
    console.log("Listen on port 8000")
})

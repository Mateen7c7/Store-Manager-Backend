const express = require("express");
const Item = require("../modules/item");

const router = express.Router();



// get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get specific item by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.findById(id);
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// find by id and update
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  try {
    const item = await Item.findByIdAndUpdate(id, update);
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// delete item by id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.findByIdAndDelete(id);
    res.send({ deleted: true });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Create a new item
router.post("/", async (req, res) => {
  const { name, broughtPrice, sellPrice, quantity, category, image, type } =
    req.body;

  try {
    const item = new Item({
      name,
      broughtPrice,
      sellPrice,
      quantity,
      category,
      image,
      type,
    });
    await item.save();
    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;

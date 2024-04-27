const express = require("express");
const app = express();
const router = new express.Router();
const User = require("./schema");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
hospitalName
city
location
bloodQuantity[]
*/
// create a hospital
router.post('/users', async (req, res) => {
  try {
    // Create a new hospital based on the request body
    const newUser = new User({
      hospitalName: req.body.hospitalName,
      city: req.body.city,
      location: req.body.location,
      bloodQuantity: req.body.bloodQuantity
    });

    // Save the new hospital to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwtkey = "e-comm";
require("./db/config");
const User = require("./db/user");
const Product = require("./db/product");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  const user = new User(req.body);
  const result = await user.save();
  jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
    if (!err) {
      resp.send({ result, auth: token });
    } else resp.send("Something went wrong");
  });
});

app.post("/login", async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    resp.send("Email, password required");
    return;
  }

  let user = await User.findOne({ email: email });

  if (user) {
    jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
      if (!err) {
        user = user.toObject();
        delete user.password;
        resp.send({ user, auth: token });
      } else resp.send("Something went wrong");
    });
  }

  if (!user) {
    resp.send("User Not Found");
    return;
  }

  if (user.password !== password) {
    resp.send("Incorrect Password");
    return;
  }
});

app.post("/add-product", verfiyToken, async (req, resp) => {
  const product = new Product(req.body);
  const result = await product.save();
  resp.send(result);
});

app.get("/products-list", verfiyToken, async (req, resp) => {
  const products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send([]);
  }
});

app.delete("/delete-product/:id", verfiyToken, async (req, resp) => {
  const product_id = req.params.id;
  const response = await Product.deleteOne({ _id: product_id });
  resp.send(response);
});

app.get("/update-product/:id",verfiyToken, async (req, resp) => {
  const product_id = req.params.id;
  const response = await Product.findOne({ _id: product_id });
  resp.send(response);
});

app.put("/update-product/:id", verfiyToken,  async (req, resp) => {
  const product_id = req.params.id;
  const updatedData = req.body;

  const response = await Product.updateOne(
    { _id: product_id },
    { $set: updatedData }
  );

  resp.send(response);
});

app.get("/search-product/:key", verfiyToken, async (req, resp) => {
  const key = req.params.key;
  const response = await Product.find({
    $or: [
      { productName: { $regex: key } },
      { category: { $regex: key } },
      { company: { $regex: key } },
    ],
  });

  resp.send(response);
});

function verfiyToken(req, resp, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    jwt.verify(token, jwtkey, (err, valid) => {
      if (err)
      {
        resp.status(401).end({result : "Please provid valid token"});
      }
      else
      {
        next();
      }
    });
  } else {
    resp.status(403).send({result : "Please add token with header"});
  }
}

app.listen(5000);

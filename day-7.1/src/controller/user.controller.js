const homeController = (req, res) => {
  res.send("Welcome to Home Page");
};

const aboutController = (req, res) => {
  res.send("Welcome to About Controller");
};

const serviceController = (req, res) => {
  res.send("Welcome to Servies controller");
};

module.exports = { homeController, aboutController, serviceController };

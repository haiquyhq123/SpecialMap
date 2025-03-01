const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const data = await userService.registerUser(req);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching and saving User data' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const data = await userService.loginUser(req);
    if (res.status == "success") {
        res.status(200).json(data);
    } else {
        res.status(400).json(data);
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while retrieving saved User data' });
  }
};

const axios = require('axios');
const pool = require('../services/mysql'); // MySQL connection pool

// Fetch data from external ArcGIS APIs, save to MySQL, and return combined GeoJSON
async function registerUser(req) {
  try {
    const userInfo = req.body;

    const insertQuery = `
      INSERT INTO users
        (name, email, phone, password)
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(insertQuery, [
      userInfo.name,
      userInfo.email,
      userInfo.phone,
      userInfo.password
    ]);

  const res = {
    message: "Success insert user"
  };

  return res;
  } catch (error) {
    console.error(` Error inserting data from page ${userInfo.name}:`, error.message);
  }
}

async function loginUser(req) {
  try {
    const { email, password} = req.query;

    const selectQuery = `
      SELECT * FROM users
        WHERE email = '${email}' AND password = '${password}' 
    `;

    const count = await pool.query(selectQuery);

   let res;
    if (count[0].length != 0) {
       res = {
        status: "success",
        message: "Login success"
      };
    } else {
       res = {
        status: "error",
        message: "Login success"
      };
    }

  return res;
  } catch (error) {
    console.error(` Error inserting data from page ${userInfo.name}:`, error.message);
  }
}

module.exports = {
    registerUser,
    loginUser,
};


var path = require('path');
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors")
const jwtlib = require('jsonwebtoken');
const bodyParser = require('body-parser')
app.use(cors());
app.use(bodyParser.json())
var PROJECT_DIR = path.normalize(__dirname);

app.use("/",express.static('./public'))
app.use('/',express.static(path.join(PROJECT_DIR, '')));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ayush3p@thi",
  database: "gradious",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});
function generateJWTForEmail(email) {
    const payload = {
        "iat": (new Date().getTime())/1000,
        "exp": (new Date().getTime())/1000+86400,
        "aud": "https://idproxy.kore.ai/authorize",
        "iss": "cs-d57d486c-77dd-577a-954b-88a2316ef76f", 
         "sub": email
}
const secret = "Wy7mv/f1gnFipwFc+5qSgffy20IPEfHz+7H5FIZ3SjY="; 
var token = jwtlib.sign(payload, secret);
console.log(token)
return token;
}  
const tableName = "kore_Users";
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
      const queryCreateTable = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(277) NOT NULL,
          age INT NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          jwt VARCHAR(300)  NOT NULL
      )
      `;
      const queryInsertUser = `INSERT INTO  ${tableName} (name ,age ,email, password , jwt) VALUES (?, ?, ?, ?, ? )`;

      connection.query(queryCreateTable, (errCreateTable) => {
          if (errCreateTable) {
              console.error("Error creating users table:", errCreateTable);
              reject(errCreateTable);
              return;
          }

          connection.query(queryInsertUser, userData, (errInsert, results) => {
              if (errInsert) {
                  console.error("Error inserting user:", errInsert);
                  reject(errInsert);
                  return;
              }
              console.log("User registered:", results.insertId);
              resolve(results);
          });
      });
  });
};
const authenticateUser = (data) => {
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
      connection.query(query, data, (err, results) => {
          if (err) {
              console.error("Error authenticating user:", err);
              reject(err);
              return;
          }

          if (results.length === 1) {
              // User with the provided email and password exists
              resolve(results[0]); // You can pass the user data if needed
          } else {
              // User with the provided email and password does not exist
              reject({ status: 401, message: "Authentication failed. Please check your email and password." });
          }
      });
  });
};


// Makeing express routes

app.post('/register', (req, res) => {
  const userData = req.body;
  const jwt = generateJWTForEmail(userData[0]);
  userData.push(jwt)
  console.log(userData)
  createUser(userData)
      .then(() => {
          res.json({ success: true, message: "User registration successful" });
      })
      .catch((error) => {
          console.error("User registration failed:", error);
          res.status(500).json({ success: false, message: "User registration failed" });
      });
});
app.post('/login', (req, res) => {
  const data = req.body;
  console.log(data)
  
  authenticateUser(data)
      .then((user) => {
          if (user) {
            // Generate JWT token for the user's email
            
            res.json({ success: true, message: "Login successful", user });
          } else {
              // Authentication failed
              res.json({ success: false, message: "Login failed. Please check your email and password." });
          }
      })
      .catch((err) => {
          console.error("Error during login:", err);
          res.status(500).json({ success: false, message: "Login failed. Please try again later." });
      });
   
});

app.get("/user/:id", (req, res) => {
    const id = req.params.id
    readuserwithid(id)
    .then((data)=>{
      console.log(data);
      res.json({ message: `Records with id ${id} retrieved`, data: data });
    })
    .catch((err)=>{
      res.status(500).json({ error: "Error reading records" });
    })
  });
  const readuserwithid = (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tableName}  where id= ${id}`;
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error reading records:", err);
          reject(err);
          return
        }
        console.log("Records retrieved:", results);
        resolve(results);
      });
    });
  };

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// context.session.BotUserSession.lastMessage.messagePayload.botInfo.customData.email
// Hi,{{context.session.BotUserSession.lastMessage.messagePayload.botInfo.customData.name}} I am Chat bot that will help you in your trip planning how can i help you?
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const sendSms = require("./twilio");
require("dotenv").config();
const { addSeconds, isAfter } = require("date-fns");
// const searchGoogleForTitle = require("./Google_title_check");
const app = express();
const multer = require("multer");
const WordExtractor = require("word-extractor");
const fs = require("fs");
const { text } = require("body-parser");
const { log } = require("console");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Extractor } = require("mammoth");
const cors = require("cors");
const textract = require("textract");
const { createWorker } = require("tesseract.js");
const secretKey = "tp tool";
const Docxtemplater = require("docxtemplater");
var wordcount = require("wordcount.js");
const replaceSpecialCharacters = require("replace-special-characters");
const googleIt = require("google-it");
const nodemailer = require("nodemailer");

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  otp: String,
});
const User = mongoose.model("User", userSchema);
app.use(express.json());
const bcrypt = require("bcrypt");
const { setTimeout } = require("timers");
const { title } = require("process");
app.post("/api/create-user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verify the token
  jwt.verify(token, "secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let decodedEmail = decoded.email;
    // console.log(decodedEmail);
    try {
      const user = await User.findOne({ email: decodedEmail }).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role.toLowerCase() !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, error: "All fields are required" });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ success: false, error: "Error creating user" });
        }

        // Create a new User instance
        const user = new User({
          name,
          email,
          password: hashedPassword, // Store the hashed password
          role,
        });

        // Save the user to the database
        user
          .save()
          .then(() => {
            return res.status(200).json({ success: true, message: "User created successfully" });
          })
          .catch((error) => {
            console.error("Error creating user:", error);
            return res.status(500).json({ success: false, error: "Error creating user" });
          });
      });
    } catch (error) {
      console.log(error);
    }
  });
});

//send mail in create new user

app.post("/api/signup", async (req, res) => {
  try {
    const formData = req.body;

    const recipient = formData.email;

    console.log(recipient);

    // Send email with the submitted data
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "jeevanantham.iro@gmail.com",
        pass: "jltllwuzvwypcbqu",
      },
    });

    const mailOptions = {
      from: "TP Tool <jeevanantham.iro@gmail.com>",
      to: recipient,
      subject: "TP Tool - New Registration",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h3 style="color: #007bff; margin-bottom: 20px;">New Sign Up Submission</h3>
      <p style="margin-bottom: 5px;"><strong>Firstname:</strong> ${formData.firstName}</p>
      <p style="margin-bottom: 5px;"><strong>Lastname:</strong> ${formData.lastName}</p>
      <p style="margin-bottom: 5px;"><strong>Email:</strong> ${formData.email}</p>
      <p style="margin-bottom: 5px;"><strong>Password:</strong> ${formData.password}</p>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send a response back to the frontend
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error.message);
    res.status(500).json({ error: "An error occurred while processing the form." });
  }
});

// Protected route example

app.get("/api/user", (req, res) => {
  // Verify the token in the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verify the token
  jwt.verify(token, "secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let decodedEmail = decoded.email;
    // console.log(decodedEmail);
    try {
      const user = await User.findOne({ email: decodedEmail }).select("-password");
      // const users = await User.find().select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
    }
  });
});

app.get("/api/users", (req, res) => {
  // Verify the token in the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verify the token
  jwt.verify(token, "secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let decodedEmail = decoded.email;
    // console.log(decodedEmail);
    try {
      const user = await User.findOne({ email: decodedEmail }).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role.toLowerCase() !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const users = await User.find().select("-password");
      if (!users) {
        return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json({ data: users });
    } catch (error) {
      console.log(error);
    }
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then((updatedUser) => {
      // Send the updated user data in the response
      res.json(updatedUser);
    })
    .catch((error) => {
      // Handle error
      console.error(error);
      res.sendStatus(500);
    });
});

//delete on the user account api
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    // console.log(user.name);

    res.status(200).json({ message: "User data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, error: "Error deleting user" });
  }
});

// CLIENT Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = jwt.sign({ email }, "secret_key", { expiresIn: "30d" });

    // Return the token and a success message
    return res.status(200).json({ token, message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ADMIN Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });

    // console.log(user);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Check if user in admin
    if (user.role.toLowerCase() !== "admin") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const welcomeMessage = `Tp Tool Your verification code ${otp}`;
    const phone = process.env.To_PHONE_NUMBER;
    sendSms(phone, welcomeMessage);
    user.otp = otp;

    console.log(welcomeMessage);
    await user.save();

    return res.status(200).json({ message: "OTP sent for verification" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/otp-verify", async (req, res) => {
  const { email, otp } = req.query;

  try {
    const user = await User.findOne({ email, otp }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    await user.save();

    const token = jwt.sign({ email, role: user.role }, "secret_key", {
      expiresIn: "1d",
    });

    return res.status(200).json({ token, user, message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/logout", (req, res) => {});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//google title checks
async function searchGoogleForTitle(title) {
  try {
    if (!title || title.trim() === "") {
      console.log("Please provide a valid title to search.");
    }

    const results = await googleIt({ query: title });

    if (!results || results.length === 0) {
      console.log("No search results found on Google.");
      return;
    }

    let matchingResult = results.find((result) => result.snippet && result.snippet.toLowerCase().includes(title.toLowerCase()));

    console.log(results);

    if (matchingResult) {
      console.log(`Found a matching title: ${matchingResult.title}`);

      console.log(`URL: ${matchingResult.link}`);
    } else {
      console.log("No matching title found on Google.");
    }
  } catch (error) {
    console.error("Error searching Google:", error.message);
  }
}

const upload = multer({ storage });
const colors = [
  "#FF0000",
  "#0000FF",
  "#FF00FF",
  "#808000",
  "#FFA500",
  "#000000",
  "#808080",
  "#3CB371",
  "#57E964",
  "#FDBD01",
  "#D4A017",
  "#513B1C",
  "#EB5406",
  "#F62217",
  "#810541",
  "#F8B88B",
  "#FF00FF",
  "#BA55D3",
  "#800080",
];
const wordMatchColor = {};
let nextMatchColor = 0;
// Read the patterns file
const patterns = JSON.parse(fs.readFileSync("patterns.json", "utf8"));

const highlightAndCountMatches = (text, patterns) => {
  const wordCounts = {};

  if (patterns && Array.isArray(patterns)) {
    patterns.forEach((patterns) => {
      let pattern_ = patterns.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

      const regex = new RegExp(`\\b${pattern_}\\b`, "gi");

      text = text.replace(regex, (match) => {
        wordCounts[match] = (wordCounts[match] || 0) + 1;

        if (!wordMatchColor[match]) {
          wordMatchColor[match] = colors[nextMatchColor];

          nextMatchColor++;

          if (nextMatchColor === colors.length) {
            nextMatchColor = 0;
          }
        }
        return ` <span style='background-color:${wordMatchColor[match]}; color: white; display:table;'>&nbsp;${match}&nbsp;</span> `;
      });
    });
  }

  const highlightedText = `
    <html>
      <head>
        <title>Highlighted Text and Word Counts</title>
      </head>
      <body>
        <div style="display:table;">
          ${text}
        </div><br/><br/>
        <div>
        <h3>Torture Phrases Word Counts:</h3>
          <ul>
            ${Object.keys(wordCounts)
              .map((key) => {
                const count = wordCounts[key];
                return `<div style='color: ${wordMatchColor[key]}; '>${key}: ${count}</div>`;
              })
              .join("")}
          </ul>
        </div>
      </body>
    </html>
  `;

  return { highlightedText, wordCounts };
};

app.post("/api/upload", upload.single("file"), (req, res) => {
  const uploadedFile = req.file;
  const title = req.body.title;

  searchGoogleForTitle(title);

  if (!uploadedFile) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const docPath = uploadedFile.path;

  const extractor = new WordExtractor();

  const extracted = extractor.extract(docPath);

  function countWords(text) {
    const trimmedText = text.trim();

    const wordsArray = trimmedText.split(/\s+/);

    const filteredWords = wordsArray.filter((word) => word !== "");

    return filteredWords.length;
  }

  extracted
    .then(function (doc) {
      const extractedText = doc.getBody();
      const wordCount = countWords(extractedText);
      console.log(`Word Count: ${wordCount}`);

      // var copyextract = extractedText;
      // copyextract = copyextract.replace('/',' ').replace('-','');
      // const count = wordcount(copyextract);
      // // console.log(copyextract);
      // console.log(`Number of words: ${count}`);

      const { highlightedText, wordCounts } = highlightAndCountMatches(extractedText, patterns);

      // Write the extracted and highlighted text to a file
      const outputPath = "output.html";
      fs.writeFileSync(outputPath, highlightedText);

      fs.unlink(docPath, (err) => {
        if (err) {
          console.error(err);
        }
      });

      res.json({
        message: "File uploaded, extracted, and highlighted successfully",
        filename: uploadedFile.originalname,
        size: uploadedFile.size,
        path: uploadedFile.path,
        extractedText,
        highlightedText,
        outputPath,
        wordCounts,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred during extraction" });
    });
});

app.listen(4000, () => {
  console.log("Server Running on port 4000");
});

// const express = require('express');
// const multer = require('multer');
// const { PDFDocument } = require('pdf-lib');
// const Docxtemplater = require('docxtemplater');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const port = 3000;

// // Set up file upload using multer
// const upload = multer({ dest: 'uploads/' });

// // Example highlighting function
// function highlightWords(text, words) {
//   words.forEach((word) => {
//     const regex = new RegExp(`\\b${word}\\b`, 'gi');
//     text = text.replace(regex, `<span style="background-color: yellow;">${word}</span>`);
//   });
//   return text;
// }

// // API endpoint to handle file upload
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     // Read the uploaded file and extract text (assuming it's a Word document)
//     const filePath = path.join(__dirname, req.file.path);
//     const fileContent = fs.readFileSync(filePath, 'binary');
//     const doc = new Docxtemplater();
//     doc.loadZip(fileContent);
//     const text = doc.getFullText();

//     // Highlight specific words in the text
//     const wordsToHighlight = ['word1', 'word2', 'word3'];
//     const highlightedText = highlightWords(text, wordsToHighlight);

//     // Convert the highlighted text to PDF
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     page.drawText(highlightedText, { x: 50, y: page.getHeight() - 100 });

//     // Save the PDF file
//     const pdfPath = path.join(__dirname, 'output.pdf');
//     const pdfBytes = await pdfDoc.save();
//     fs.writeFileSync(pdfPath, pdfBytes);

//     // Respond with the download link to the converted PDF
//     res.json({ downloadLink: `/download` });
//   } catch (err) {
//     res.status(500).json({ error: 'An error occurred while processing the file.' });
//   }
// });

// // API endpoint to download the converted PDF
// app.get('/download', (req, res) => {
//   const pdfPath = path.join(__dirname, 'output.pdf');
//   res.download(pdfPath, 'highlighted_document.pdf', (err) => {
//     if (err) {
//       res.status(500).json({ error: 'An error occurred while downloading the file.' });
//     } else {
//       // Clean up the generated files after download
//       fs.unlinkSync(pdfPath);
//       fs.unlinkSync(path.join(__dirname, req.file.path));
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

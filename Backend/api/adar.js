const fs = require('fs');
const path = require('path');
const User = require('../models/userSchema');
const { extractTextFromImage } = require('../utils/verification');
const moment = require('moment');

/**
 * Verifies Aadhaar card details against user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function verifyAadhaar(req, res) {
  let filePath = null;
  try {
    const { userId } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({
        message: "Missing required fields: userId are required",
      });
    }

    const user = await User.findById(userId);
    const aadhaarNumber = user.aadhaar;

    // Validate Aadhaar number format (12 digits with spaces)
    if (!/^\d{4} \d{4} \d{4}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        message: "Invalid Aadhaar number format. Must be 12 digits with spaces",
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if Aadhaar is already verified
    if (user.aadhaarVerified) {
      return res.status(400).json({ message: "Aadhaar already verified" });
    }

    // Validate file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Aadhaar image file is required" });
    }

    filePath = req.file.path;

    // Extract text from uploaded Aadhaar image
    const extractedText = await extractTextFromImage(filePath);
    if (!extractedText) {
      return res.status(400).json({ message: "Failed to extract text from image" });
    }

    // Verify Aadhaar number
    if (!extractedText.includes(aadhaarNumber)) {
      return res.status(400).json({
        message: "Aadhaar number in image doesn't match provided number",
      });
    }

    // Extract and verify DOB
    const dobMatch = extractedText.match(/DOB:\s*(\d{2}\/\d{2}\/\d{4})/);
    if (!dobMatch) {
      return res.status(400).json({
        message: "Date of birth not found in Aadhaar image",
      });
    }

    const extractedDOB = moment(dobMatch[1], "DD/MM/YYYY");
    const userDOB = moment(user.dob);

    if (!extractedDOB.isValid() || !userDOB.isValid()) {
      return res.status(400).json({
        message: "Invalid date format in DOB",
      });
    }

    if (!extractedDOB.isSame(userDOB, 'day')) {
      return res.status(400).json({
        message: "Date of birth doesn't match registered DOB",
        details: {
          aadhaarDOB: extractedDOB.format("DD/MM/YYYY"),
          registeredDOB: userDOB.format("DD/MM/YYYY"),
        },
      });
    }

    // Extract phone number if present (optional)
    const phoneMatch = extractedText.match(/\b\d{10}\b/);
    if (phoneMatch && phoneMatch[0] === user.phone) {
      user.adar_phoneno = phoneMatch[0];
    }

    // Update user record
    user.aadhaarVerified = true;
    user.phoneVerified = true;
    user.aadhaarVerificationDate = new Date();
    await user.save();

    // Return success response
    return res.json({
      message: "Aadhaar verification successful",
      data: {
        aadharPhone: user.adar_phoneno || null,
        verifiedDOB: extractedDOB.format("DD/MM/YYYY"),
        verificationDate: user.aadhaarVerificationDate,
      },
    });
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    // Handle error response
    res.status(500).json({
      message: "Error during Aadhaar verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // Always delete the uploaded file after processing or in case of error
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        } else {
          console.log(`Successfully deleted file ${filePath}`);
        }
      });
    }
  }
}

module.exports = verifyAadhaar;

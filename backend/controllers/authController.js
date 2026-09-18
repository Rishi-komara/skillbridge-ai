import { db } from "../config/firebase.js";

// Create or update user profile after Firebase signup
export const createUserProfile = async (req, res) => {
  try {
    const uid = req.uid;
    const email = req.email;

    const { name, role = "student" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const userRef = db.ref(`users/${uid}`);

    const snapshot = await userRef.once("value");

    // If user already exists, don't create duplicate data
    if (snapshot.exists()) {
      return res.status(200).json({
        success: true,
        message: "User profile already exists",
        user: snapshot.val(),
      });
    }

    const userData = {
      uid,
      name,
      email: email || "",
      role,

      targetRole: "",
      college: "",
      graduationYear: "",
      skills: [],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(userData);

    return res.status(201).json({
      success: true,
      message: "User profile created successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user profile",
    });
  }
};


// Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const uid = req.uid;

    console.log("3. getUserProfile started");

    const snapshot = await db.ref(`users/${uid}`).once("value");

    console.log("4. Firebase DB read completed");

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    console.log("5. Sending profile response");

    return res.status(200).json({
      success: true,
      user: snapshot.val(),
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};
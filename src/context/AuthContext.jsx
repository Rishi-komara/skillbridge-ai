import React, { createContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

import apiClient from "../config/api";
import { auth } from "../config/firebase";

export const AuthContext = createContext();

const clearStoredAuth = () => {
  localStorage.removeItem("skillbridge-user");
  localStorage.removeItem("skillbridge-token");
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK USER WHEN APP LOADS
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get fresh Firebase token
            const token = await firebaseUser.getIdToken();

            localStorage.setItem(
              "skillbridge-token",
              token
            );

            // Get profile from our backend
            const response = await apiClient.get(
              "/auth/profile"
            );

            const profile = response.data?.user || null;

            const user = profile
              ? {
                  ...profile,
                  uid: firebaseUser.uid,
                  email:
                    firebaseUser.email ||
                    profile.email,
                }
              : {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name:
                    firebaseUser.displayName || "",
                };

            localStorage.setItem(
              "skillbridge-user",
              JSON.stringify(user)
            );

            setCurrentUser(user);
          } catch (error) {
            console.log(
              "PROFILE LOAD ERROR:",
              error
            );

            // Firebase user exists but profile may not exist yet
            const fallbackUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name:
                firebaseUser.displayName || "",
            };

            localStorage.setItem(
              "skillbridge-user",
              JSON.stringify(fallbackUser)
            );

            setCurrentUser(fallbackUser);
          }
        } else {
          clearStoredAuth();
          setCurrentUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // SIGNUP
  // ==========================================

  const signup = async (
    email,
    password,
    name
  ) => {
    try {
      console.log(
        "========== SIGNUP START =========="
      );

      // 1. Create account using Firebase Authentication
      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser = credential.user;

      console.log(
        "Firebase User Created:",
        firebaseUser.uid
      );

      // 2. Get Firebase ID token
      const token =
        await firebaseUser.getIdToken();

      // 3. Save token
      localStorage.setItem(
        "skillbridge-token",
        token
      );

      // 4. Create SkillBridge profile in backend
      // Password is NOT sent to backend
      const response =
        await apiClient.post(
          "/auth/profile",
          {
            name,
            role: "student",
          }
        );

      const user =
        response.data?.user || null;

      if (user) {
        localStorage.setItem(
          "skillbridge-user",
          JSON.stringify(user)
        );

        setCurrentUser(user);
      }

      console.log(
        "Profile Created Successfully:",
        user
      );

      return response;
    } catch (error) {
      console.log(
        "========== SIGNUP ERROR =========="
      );

      console.log(
        "ERROR CODE:",
        error.code
      );

      console.log(
        "ERROR MESSAGE:",
        error.message
      );

      throw error;
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email,
    password
  ) => {
    try {
      // 1. Firebase checks email + password
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser = credential.user;

      // 2. Get Firebase ID token
      const token =
        await firebaseUser.getIdToken();

      // 3. Save token
      localStorage.setItem(
        "skillbridge-token",
        token
      );

      // 4. Get profile from backend
      const response =
        await apiClient.get(
          "/auth/profile"
        );

      const user =
        response.data?.user || null;

      if (user) {
        localStorage.setItem(
          "skillbridge-user",
          JSON.stringify(user)
        );

        setCurrentUser(user);
      }

      return response;
    } catch (error) {
      console.log(
        "LOGIN ERROR:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    await firebaseSignOut(auth);

    clearStoredAuth();

    setCurrentUser(null);
  };

  // ==========================================

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

// Simple hash function للتعلم فقط (NOT production-safe)
function hashPassword(password) {
  return btoa(password);
}

function verifyPassword(password, hash) {
  return btoa(password) === hash;
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  function signUp(email, password) {
    email = email.trim().toLowerCase();

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    const users = getStoredUsers();

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    const newUser = {
      id: Date.now(),
      email,
      password: hashPassword(password),
    };

    saveUsers([...users, newUser]);

    const loggedUser = { 
      id: newUser.id,
      email: newUser.email,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(loggedUser)
    );

    setUser(loggedUser);

    return {
      success: true,
    };
  }


  function login(email, password) {
    email = email.trim().toLowerCase();

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    const users = getStoredUsers();

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (!existingUser) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const passwordValid = verifyPassword(
      password,
      existingUser.password
    );

    if (!passwordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const loggedUser = {
      id: existingUser.id,
      email: existingUser.email,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(loggedUser)
    );

    setUser(loggedUser);

    return {
      success: true,
    };
  }


  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
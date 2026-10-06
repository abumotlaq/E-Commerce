import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { User, StoredUser, AuthResult } from "../types";

interface AuthContextValue {
  user: User | null;
  signUp: (email: string, password: string) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isStoredUser(value: unknown): value is StoredUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    typeof value.email === "string" &&
    "password" in value &&
    typeof value.password === "string"
  );
}

function readUsers(): StoredUser[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem("users") || "[]");
    return Array.isArray(parsed) ? parsed.filter(isStoredUser) : [];
  } catch {
    return [];
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const savedEmail = localStorage.getItem("currentUserEmail");
  const [user, setUser] = useState<User | null>(
    savedEmail ? { email: savedEmail } : null
  );

  function signUp(email: string, password: string): AuthResult {
    const users = readUsers();

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });

    return { success: true };
  }

  function login(email: string, password: string): AuthResult {
    const users = readUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUserEmail", email);
    setUser({ email });

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signUp, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
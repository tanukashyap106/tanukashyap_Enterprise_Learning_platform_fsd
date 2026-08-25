import React from "react";
import { useAuth } from "../context/AuthContext";
import WorkforceDashboard from "./WorkforceDashboard";
import WorkforceEmployeeDashboard from "./WorkforceEmployeeDashboard";

export default function WorkforceHome() {
  const { user } = useAuth();

  if (user && user.role === "EMPLOYEE") {
    return <WorkforceEmployeeDashboard />;
  }

  return <WorkforceDashboard />;
}

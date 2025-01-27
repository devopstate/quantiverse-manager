import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Inventory Pro</h1>
          <p className="text-gray-600">Manage your inventory with ease</p>
        </div>
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
    </div>
  );
};

export default Index;
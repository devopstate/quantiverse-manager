import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Inventory Pro</h1>
          <p className="text-gray-600">Manage your inventory with ease</p>
        </div>
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {/* Dashboard content will be added here */}
      </main>
    </div>
  );
};

export default Index;
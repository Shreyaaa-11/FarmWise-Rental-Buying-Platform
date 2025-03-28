
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">FarmGear</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.email}</span>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login / Register</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to FarmGear</h2>
              <p className="mb-4">Your one-stop shop for farming equipment sales and rentals.</p>
              {!user && (
                <p>
                  <Link to="/auth">
                    <Button className="mt-4">Login or Register to start shopping</Button>
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FarmGear. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;

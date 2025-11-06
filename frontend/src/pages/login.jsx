import React from "react";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Welcome to FAT-EIBL
        </h1>
        <p className="text-gray-500 mb-4">
          Finance Audit Tracker – Edme Insurance Brokers Limited
        </p>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-64 mb-3 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-64 mb-3 rounded"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded w-64"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

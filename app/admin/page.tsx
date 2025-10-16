"use client";

import React from "react";

const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Welcome to the Admin Dashboard
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Here you can manage all admin settings and view dashboard statistics.
      </p>
    </div>
  );
};

export default AdminDashboardPage;

import React from 'react';
import { School } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <School size={24} />
          <span className="text-xl font-bold">Student Hostel Portal</span>
        </Link>
        <Link to="/admin" className="hover:text-blue-200">Admin Dashboard</Link>
      </div>
    </header>
  );
}
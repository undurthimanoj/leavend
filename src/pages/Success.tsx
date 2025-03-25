import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Successfully Submitted!</h2>
        <p className="mt-2 text-gray-600">
          Your leave application has been submitted successfully.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
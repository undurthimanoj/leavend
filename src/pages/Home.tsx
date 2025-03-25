import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">
            Student Leave Application Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Submit your leave application easily through our online portal
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="mr-2" />
            Apply for Leave
          </Link>
        </div>
      </div>
    </div>
  );
}
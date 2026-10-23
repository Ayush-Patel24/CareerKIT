import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container page-content flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-5xl font-extrabold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-sm text-muted max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home size={15} />}>
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
}

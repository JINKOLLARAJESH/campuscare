import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-royal-100 dark:bg-royal-950 text-royal-600 dark:text-royal-400 flex items-center justify-center mb-4 shadow">
        <Shield className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-navy-900 dark:text-white mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        The campus grievance route or file you requested does not exist or has been relocated under confidentiality protocols.
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/')}
        leftIcon={<Home className="w-4 h-4" />}
      >
        Return to Home Portal
      </Button>
    </div>
  );
};

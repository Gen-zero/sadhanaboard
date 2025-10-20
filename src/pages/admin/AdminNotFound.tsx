import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import CosmicBackground from '@/components/admin/CosmicBackground';

const AdminNotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-[-1]">
        <CosmicBackground />
      </div>
      
      <motion.div
        className="text-center max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Cosmic Path Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The celestial coordinates you're seeking don't exist in this universe. 
            Perhaps you took a wrong turn in the space-time continuum?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/admin"
            className="cosmic-button px-6 py-3 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Command Center
          </Link>
          
          <Link
            to="/admin"
            className="cosmic-button px-6 py-3 flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Explore Cosmos
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <p>🌌 Lost in the cosmic void? Contact Mission Control for assistance.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminNotFound;
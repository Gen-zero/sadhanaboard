import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CosmicLibraryManager from '@/components/admin/CosmicLibraryManager';

const AdminLibraryPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CosmicLibraryManager />
    </motion.div>
  );
};

export default AdminLibraryPage;

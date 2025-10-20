import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import CosmicSystemHealthDashboard from '@/components/admin/CosmicSystemHealthDashboard';

const AdminSystemPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CosmicSystemHealthDashboard />
    </motion.div>
  );
};

export default AdminSystemPage;

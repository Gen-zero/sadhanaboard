import React from 'react';
import { motion } from 'framer-motion';
import CosmicUserManager from '@/components/admin/CosmicUserManager';

const AdminUsersPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CosmicUserManager />
    </motion.div>
  );
};

export default AdminUsersPage;

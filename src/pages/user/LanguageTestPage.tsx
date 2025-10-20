import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';

const LanguageTestPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Language Test Page</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Current Language: {i18n.language}</h2>
          
          <div className="space-y-4">
            <p><strong>Settings:</strong> {t('settings')}</p>
            <p><strong>General:</strong> {t('general')}</p>
            <p><strong>Display Name:</strong> {t('display_name')}</p>
            <p><strong>Email:</strong> {t('email')}</p>
            <p><strong>Theme:</strong> {t('theme')}</p>
            <p><strong>Language:</strong> {t('language')}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => changeLanguage('en')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            English
          </button>
          <button 
            onClick={() => changeLanguage('hi')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Hindi
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LanguageTestPage;
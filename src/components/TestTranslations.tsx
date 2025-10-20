import React from 'react';
import { useTranslation } from 'react-i18next';

const TestTranslations = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 bg-background/50 rounded-lg border border-purple-500/20 mt-6">
      <h3 className="text-lg font-semibold mb-2">Translation Test</h3>
      <p>Current language: {i18n.language}</p>
      <p>Settings: {t('settings')}</p>
      <p>General: {t('general')}</p>
      <p>Display Name: {t('display_name')}</p>
      <p>Email: {t('email')}</p>
      <p>Theme: {t('theme')}</p>
      <p>Language: {t('language')}</p>
      
      <div className="flex gap-2 mt-4">
        <button 
          onClick={() => changeLanguage('en')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('hi')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
        >
          Hindi
        </button>
      </div>
    </div>
  );
};

export default TestTranslations;
import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function NotFoundComponent (){
  const { t } = useLanguage();
  return <h1>{t('notFound')}</h1>;
}

export default NotFoundComponent;

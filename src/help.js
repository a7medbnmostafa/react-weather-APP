import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return <h1>{t('Welcome to React')}</h1>
}

// i18n translations might still be loaded by the http backend
// use react's Suspense
export default function Apps() {
  return (
    <Suspense fallback="loading">
      <MyComponent />
    </Suspense>
  );
}
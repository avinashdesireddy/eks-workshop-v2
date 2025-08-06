import React from 'react';
import GlobalNotification from '../../components/GlobalNotification';
import AutoSidebarLinks from '../../components/AutoSidebarLinks';

export default function Root({children}) {
  return (
    <>
      <GlobalNotification />
      <AutoSidebarLinks />
      {children}
    </>
  );
}
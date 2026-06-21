import { Outlet } from 'react-router-dom';
import { SiteNavbar } from '../components/layout/SiteNavbar.jsx';

export function MainLayout() {
  return (
    <>
      <SiteNavbar />
      <Outlet />
    </>
  );
}

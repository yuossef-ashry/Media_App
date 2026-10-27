import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import { FeedPage } from './pages/FeedPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegistrationPage } from './pages/RegistrationPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserDetailPage } from './pages/UserDetailPage';
function ProtectedRoute() {
    return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/login" replace/>;
}
function GuestRoute() {
    return localStorage.getItem('token') ? <Navigate to="/feed" replace/> : <Outlet />;
}
export function App() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const onLoading = (event) => setLoading(Boolean(event.detail));
        window.addEventListener('app:loading', onLoading);
        return () => window.removeEventListener('app:loading', onLoading);
    }, []);
    return (<HashRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route index element={<Navigate to="/registration" replace/>}/>
            <Route path="registration" element={<RegistrationPage />}/>
            <Route path="login" element={<LoginPage />}/>
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="feed" element={<FeedPage />}/>
            <Route path="profile" element={<ProfilePage />}/>
            <Route path="profile/:id" element={<UserDetailPage />}/>
            <Route path="Post-Details/:id" element={<PostDetailPage />}/>
            <Route path="settings" element={<SettingsPage />}/>
            <Route path="notifications" element={<NotificationsPage />}/>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
      <LoadingOverlay visible={loading}/>
    </HashRouter>);
}

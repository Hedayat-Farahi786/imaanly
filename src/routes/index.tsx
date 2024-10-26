import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/home';
import Prayers from '@/pages/prayers';
import Quran from '@/pages/quran';
import QuranBookmarks from '@/pages/quran/bookmarks';
import Duas from '@/pages/duas';
import Favorites from '@/pages/favorites';
import Dhikr from '@/pages/dhikr';
import Tasbih from '@/pages/tasbih';
import PrayerGuide from '@/pages/learn/prayer-guide';
import QuranGuide from '@/pages/learn/quran-guide';
import Login from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';
import Profile from '@/pages/profile';
import Community from '@/pages/community';
import Ramadan from '@/pages/ramadan';
import Calendar from '@/pages/calendar';
import PrivateRoute from '@/components/private-route';
import { useAuth } from '@/contexts/auth-context';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/prayers" element={<Prayers />} />
      <Route path="/quran" element={<Quran />} />
      <Route path="/quran/bookmarks" element={<QuranBookmarks />} />
      <Route path="/duas" element={<Duas />} />
      <Route path="/duas/favorites" element={<Favorites />} />
      <Route path="/dhikr" element={<Dhikr />} />
      <Route path="/dhikr/tasbih" element={<Tasbih />} />
      <Route path="/ramadan" element={<Ramadan />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/community" element={<Community />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route path="/learn">
        <Route
          path="prayer"
          element={
            <PrivateRoute>
              <PrayerGuide />
            </PrivateRoute>
          }
        />
        <Route
          path="quran"
          element={
            <PrivateRoute>
              <QuranGuide />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
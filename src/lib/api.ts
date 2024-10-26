import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // Set the Authorization header after successful login
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      // Set the Authorization header after successful registration
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    // Clear the Authorization header
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Ensure the token is set in headers before making the request
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await api.get('/auth/me');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get user data');
      }
      throw error;
    }
  },
};

export const prayerService = {
  getTimes: async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const dateStr = `${dd}-${mm}-${yyyy}`;

      const response = await axios.get(
        `${import.meta.env.VITE_ALADHAN_API_URL}/timings/${dateStr}`,
        {
          params: {
            latitude,
            longitude,
            method: 2,
            school: 1,
          },
          timeout: 10000,
        }
      );

      if (!response.data?.data?.timings) {
        throw new Error('Invalid response from prayer times API');
      }

      const timings = response.data.data.timings;
      const now = new Date();
      let nextPrayerFound = false;

      const requiredPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      for (const prayer of requiredPrayers) {
        if (!timings[prayer] || !/^\d{2}:\d{2}$/.test(timings[prayer])) {
          throw new Error(`Invalid or missing time for ${prayer} prayer`);
        }
      }

      const prayers = [
        { id: 'fajr', name: 'Fajr', time: timings.Fajr },
        { id: 'dhuhr', name: 'Dhuhr', time: timings.Dhuhr },
        { id: 'asr', name: 'Asr', time: timings.Asr },
        { id: 'maghrib', name: 'Maghrib', time: timings.Maghrib },
        { id: 'isha', name: 'Isha', time: timings.Isha },
      ].map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);

        const isPassed = now > prayerTime;
        const isNext = !nextPrayerFound && !isPassed;
        if (isNext) nextPrayerFound = true;

        return {
          ...prayer,
          isPassed,
          isNext,
          completed: false,
        };
      });

      return prayers;
    } catch (error) {
      console.error('Prayer times API error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        if (!error.response) {
          throw new Error('Network error. Please check your connection.');
        }
        throw new Error(error.response.data?.message || 'Failed to fetch prayer times');
      }
      
      throw new Error('Failed to fetch prayer times. Please try again later.');
    }
  },

  trackPrayer: async (prayerId: string, completed: boolean) => {
    try {
      const { data } = await api.post('/prayer/track', {
        prayerId,
        completed,
        timestamp: new Date().toISOString(),
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to track prayer');
      }
      throw error;
    }
  },

  getQiblaDirection: async (latitude: number, longitude: number) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_ALADHAN_API_URL}/qibla/${latitude}/${longitude}`
      );
      return data?.data?.direction || 0;
    } catch (error) {
      console.error('Error fetching qibla direction:', error);
      throw new Error('Failed to get Qibla direction');
    }
  },
};

export const quranService = {
  getSurah: async (surahId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_QURAN_CLOUD_API_URL}/surah/${surahId}/editions/quran-uthmani,en.sahih`
      );
      return response.data?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch surah');
      }
      throw error;
    }
  },

  getBookmarks: async () => {
    try {
      const { data } = await api.get('/quran/bookmarks');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch bookmarks');
      }
      throw error;
    }
  },

  addBookmark: async (surahId: number, ayahNumber: number, note?: string) => {
    try {
      const { data } = await api.post('/quran/bookmarks', {
        surahId,
        ayahNumber,
        note,
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add bookmark');
      }
      throw error;
    }
  },

  removeBookmark: async (bookmarkId: string) => {
    try {
      const { data } = await api.delete(`/quran/bookmarks/${bookmarkId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to remove bookmark');
      }
      throw error;
    }
  },
};

export const duaService = {
  getCategories: async () => {
    try {
      const { data } = await api.get('/dua/categories');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
      }
      throw error;
    }
  },

  getDuas: async (category: string) => {
    try {
      const { data } = await api.get(`/dua/category/${category}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch duas');
      }
      throw error;
    }
  },

  getFavorites: async () => {
    try {
      const { data } = await api.get('/dua/favorites');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
      }
      throw error;
    }
  },

  toggleFavorite: async (duaId: string) => {
    try {
      const { data } = await api.post(`/dua/favorites/${duaId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
      }
      throw error;
    }
  },
};

export const mosqueService = {
  getNearby: async (latitude: number, longitude: number, radius: number = 5000) => {
    try {
      const { data } = await api.get(
        `/mosques/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch nearby mosques');
      }
      throw error;
    }
  },

  getMosqueDetails: async (mosqueId: string) => {
    try {
      const { data } = await api.get(`/mosques/${mosqueId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch mosque details');
      }
      throw error;
    }
  },
};

export const progressService = {
  getPrayerProgress: async () => {
    try {
      const { data } = await api.get('/progress/prayer');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch prayer progress');
      }
      throw error;
    }
  },

  getQuranProgress: async () => {
    try {
      const { data } = await api.get('/progress/quran');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Quran progress');
      }
      throw error;
    }
  },

  updateProgress: async (type: string, progress: any) => {
    try {
      const { data } = await api.post(`/progress/${type}`, progress);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update progress');
      }
      throw error;
    }
  },
};

export default api;
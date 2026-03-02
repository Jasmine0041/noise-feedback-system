import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { FeedbackPage } from './pages/FeedbackPage/FeedbackPage';
import { StatisticsPage } from './pages/StatisticsPage/StatisticsPage';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { NotFound } from './pages/NotFound/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FeedbackPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
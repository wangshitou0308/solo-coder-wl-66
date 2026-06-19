
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Dashboard from '@/pages/Dashboard';
import NewRecord from '@/pages/NewRecord';
import RecordsList from '@/pages/RecordsList';
import KnowledgeBase from '@/pages/KnowledgeBase';
import MapView from '@/pages/MapView';
import RecordDetail from '@/pages/RecordDetail';

export default function App() {
  return (
    <BrowserRouter>
      <PageContainer>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/record/new" element={<NewRecord />} />
          <Route path="/record/edit/:id" element={<NewRecord />} />
          <Route path="/record/:id" element={<RecordDetail />} />
          <Route path="/records" element={<RecordsList />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  );
}

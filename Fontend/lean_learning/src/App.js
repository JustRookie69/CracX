import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import NameCard from './components/nameCard/NameCard';
import QuestionSection from './components/QuestionSection/questionSection';
import QuestPage from './pages/questPage/QuestPage';
import QuestionDetailPage from './pages/questionDetailPage/QuestionDetailPage'; // Import the new page

const HomePage = () => (
  <>
    <NameCard />
    <QuestionSection />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main className="App-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quest" element={<QuestPage />} />
            {/* Add the dynamic route for individual question concepts */}
            <Route path="/question/:questionId" element={<QuestionDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
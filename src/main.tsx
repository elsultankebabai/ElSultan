import { createRoot } from 'react-dom/client';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/900.css';
import '@fontsource/fira-sans/cyrillic-400.css';
import '@fontsource/fira-sans/cyrillic-700.css';
import '@fontsource/fira-sans/cyrillic-900.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

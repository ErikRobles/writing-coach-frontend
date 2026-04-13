import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SplashScreen } from '@capacitor/splash-screen'

const AppWrapper = () => {
  useEffect(() => {
    // Hide the splash screen after a short delay to ensure React has painted
    const hideSplash = async () => {
      try {
        // Wait 500ms after mount to ensure the initial frame is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        await SplashScreen.hide();
      } catch (e) {
        console.warn("SplashScreen error", e);
      }
    };
    hideSplash();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<AppWrapper />);

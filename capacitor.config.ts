import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.writingcoach.ai',
  appName: 'Writing Coach',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark'
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: "#0e0e10",
      showSpinner: true,
      iosSpinnerStyle: "small",
      spinnerColor: "#a9ffdf"
    }
  }
};

export default config;

import './global.css';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useUixvisorFonts } from '@registry/theme/use-uixvisor-fonts';
import { ToastProvider } from '@registry/toast/toast';

import { GestureRoot } from './gesture-root';
import { useShowcaseNavigation } from './src/navigation';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { DemoScreen } from './src/screens/DemoScreen';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  // Inter is the default face; the app still renders on the system font while
  // it loads, so there is no splash gate here.
  useUixvisorFonts();
  const navigation = useShowcaseNavigation();

  let body = null;
  switch (navigation.current.name) {
    case 'home':
      body = <HomeScreen navigation={navigation} />;
      break;
    case 'category':
      body = (
        <CategoryScreen category={navigation.current.category} navigation={navigation} />
      );
      break;
    case 'demo':
      body = <DemoScreen itemId={navigation.current.itemId} navigation={navigation} />;
      break;
  }

  return (
    <SafeAreaProvider>
      <GestureRoot>
        <ToastProvider>
          {body}
          <StatusBar style="auto" />
        </ToastProvider>
      </GestureRoot>
    </SafeAreaProvider>
  );
}

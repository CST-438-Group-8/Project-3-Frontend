import 'react-native-gesture-handler';
import { UserInfo } from 'components/UserInfo';
import { ThemeProvider } from 'styled-components';
import { theme } from './components/theme';

import RootStack from './navigation';

export default function App() {
  return (
    <UserInfo>
      <ThemeProvider theme={theme}>
        <RootStack />
      </ThemeProvider>
    </UserInfo>
  );
}

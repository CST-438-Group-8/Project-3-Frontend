import 'react-native-gesture-handler';
import { UserProvider }  from './components/UserProvider';

import RootStack from './navigation';

export default function App() {
  return( 
    <UserProvider>
      <RootStack />
    </UserProvider>
  );
}

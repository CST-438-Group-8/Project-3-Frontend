import 'react-native-gesture-handler';
import { UserInfo } from 'components/UserInfo';

import RootStack from './navigation';

export default function App() {
  return (
    <UserInfo>
      <RootStack />
    </UserInfo>
  );
}

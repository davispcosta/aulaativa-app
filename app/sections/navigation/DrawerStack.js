import { createDrawerNavigator } from 'react-navigation';

import { Classes } from '../../views/classes/Classes';
import { Rank } from '../../views/board/Rank';
import { MaterialTabs } from '../MaterialTabs';

const DrawerStack = createDrawerNavigator({
    MaterialTabs: { screen: MaterialTabs },
    Classes: { screen: Classes },
}, {
    navigationOptions: {
      header: null
    }
});
export default DrawerStack;
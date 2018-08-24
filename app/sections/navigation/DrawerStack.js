import { createDrawerNavigator } from 'react-navigation';

import { Classes } from '../../views/classes/Classes';
import { Rank } from '../../views/board/Rank';
import { Question } from '../../views/quizes/Question';
import { MaterialTabs } from '../MaterialTabs';

const DrawerStack = createDrawerNavigator({
    MaterialTabs: { screen: MaterialTabs },
    Rank: { screen: Rank },
    Question: { screen: Question },
    Classes: { screen: Classes },
}, {
    navigationOptions: {
      header: null
    }
});
export default DrawerStack;
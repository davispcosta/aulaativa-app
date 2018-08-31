import { createStackNavigator } from 'react-navigation';

import { Login } from '../../views/login/Login';
import { Register } from '../../views/login/Register';
import { ChooseRegister } from '../../views/login/ChooseRegister';
import { Classes } from '../../views/classes/Classes';
import { Rank } from '../../views/board/Rank';
import { Question } from '../../views/quizes/Question';
import { MaterialTabs } from '../MaterialTabs';

const NavigationStack = createStackNavigator({
    LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register },
    ChooseRegisterScreen: { screen: ChooseRegister },
    MaterialTabs: { screen: MaterialTabs },
    Rank: { screen: Rank },
    Question: { screen: Question },
    Classes: { screen: Classes }
}, {
    navigationOptions: {
      header: null
    }
});
export default NavigationStack;
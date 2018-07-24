import { createStackNavigator } from 'react-navigation';

import { Login } from '../../views/login/Login';
import { Register } from '../../views/login/Register';

const LoginStack = createStackNavigator({
    LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register }
});
export default LoginStack;
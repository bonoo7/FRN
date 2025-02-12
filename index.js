import { AppRegistry, Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  AppRegistry.runApplication('main', {
    initialProps: {},
    rootTag: document.getElementById('root')
  });
} else {
  registerRootComponent(App);
}

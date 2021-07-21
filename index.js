/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import axios from "axios";
import Host  from './src/Api/util';
axios.defaults.baseURL = Host;

AppRegistry.registerComponent(appName, () => App);

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './pages/Layout';
import HonoTool from './pages/HonoTool';
import Growth from './pages/Growth';
import Performances from './pages/Performances'
import CustomTabBar from './Components/CustomTabBar';
import ToolPicto from './assets/tool.png'
import ToolPictoG from './assets/tool-g.png'
import HomePicto from './assets/home.png'
import HomePictoG from './assets/home-g.png'
import PerformPicto from './assets/perform.png'
import PerformPictoG from './assets/perform-g.png'
import CustomHeader from './Components/CustomHeader';
import GrowthPicto from './assets/growth.png';
import GrowthPictoG from './assets/growth-g.png';
import { LogProvider } from './Context/AuthContext';
import { DataProvider } from './Context/StorageContext';
import CustomDrawerContent from './Components/CustomDrawerContent';
import Recommandation from './pages/Recommandation';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();



function GrowthStack() {

  return (
    <Stack.Navigator initialRouteName="Growth" >
      <Stack.Screen name="Growth" component={Growth} options={{ header: (props) => <CustomHeader {...props} /> }} />
      <Stack.Screen
        name="Recommandation"
        options={{ header: ({ navigation }) => <CustomHeader navigation={navigation} backTitle={"Growth Share"} /> }}
        component={Recommandation}

      />
    </Stack.Navigator>
  );
}

function AppScreen() {

  return (
    <Layout>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} initialRouteName="Home" >
        <Tab.Screen options={{ picto: { red: HomePicto, grey: HomePictoG }, header: (props) => <CustomHeader {...props} /> }} name="Home" component={Home} />
        <Tab.Screen options={{ picto: { red: PerformPicto, grey: PerformPictoG }, header: (props) => <CustomHeader {...props} /> }} name="Performances" component={Performances} />
        <Tab.Screen options={{ picto: { red: ToolPicto, grey: ToolPictoG }, header: (props) => <CustomHeader {...props} /> }} name="HonoTool" component={HonoTool} />
        <Tab.Screen options={{ picto: { red: GrowthPicto, grey: GrowthPictoG }, headerShown: false }} name="GrowthShare" component={GrowthStack} />
      </Tab.Navigator>
    </Layout>
  );
}

const AuthStack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Tab" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Tab" component={AppScreen} />
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}



const App = () => {

  return (
    <LogProvider>
      <DataProvider>
        <Layout>
          <NavigationContainer >
            <Drawer.Navigator
              initialRouteName="main"
              screenOptions={{
                headerShown: false,
                drawerStyle: { width: '80%' }
              }}
              drawerContent={props => <CustomDrawerContent {...props} />}
            >
              <Drawer.Screen name="main" component={MainNavigator} />
            </Drawer.Navigator>
          </NavigationContainer>
        </Layout>
      </DataProvider>
    </LogProvider >
  );
};

export default App;









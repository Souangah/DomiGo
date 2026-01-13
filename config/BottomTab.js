import { View, Text, StyleSheet, Alert } from 'react-native';
import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Menu from '../screens/menu';
import Parametre from '../screens/parametre';
import Notification from '../screens/notification';
import ListeService from '../screens/liste-service';
import PublierService from '../screens/publier-service';
import { useNavigation } from '@react-navigation/native';

import { GlobalContext } from './GlobalUser'; 

const Tab = createBottomTabNavigator();

export default function BottomTab() {

  const {user, setUser} = useContext(GlobalContext);
  
  const navigation = useNavigation();

  // Fonction pour vérifier si l'utilisateur est connecté
  const checkAuthAndNavigate = () => {
    if (user && user.telephone) { // Vérifie si l'utilisateur est connecté
      navigation.navigate('PublierService');
    } else {
      // Redirige vers l'écran de connexion
      Alert.alert(
        'Connexion requise',
        'Vous devez vous connecter pour publier un service.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Connexion') }
        ]
      );
    }
  };

  // Fonction pour gérer la navigation via les tabs
  const handleTabPress = (e, route) => {
    if (route.name === 'PublierService') {
      e.preventDefault(); // Empêche la navigation par défaut
      checkAuthAndNavigate();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{flex:1}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {user && user.nom_prenom ? user.nom_prenom : 'Invité'} 
          </Text>
          <Image 
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </View>
     
        <Tab.Navigator 
          initialRouteName='Menu'
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;

              switch (route.name) {
                case 'Menu':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'ListeService':
                  iconName = focused ? 'briefcase' : 'briefcase-outline';
                  break;
                case 'PublierService':
                  iconName = focused ? 'heart' : 'heart-outline';
                  break;
                case 'Notification':
                  iconName = focused ? 'notifications' : 'notifications-outline';
                  break;
                case 'Parametre':
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
                default:
                  iconName = 'ellipse-outline';
              }

              return <Ionicons name={iconName} size={25} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Menu"
            component={Menu}
            options={{ tabBarLabel: 'Menu' }}
          />
          <Tab.Screen
            name="ListeService"
            component={ListeService}
            listeners={({navigation, route}) => ({
              tabPress: e => {
                if(route.name === 'ListeService' && (!user || !user.telephone)){
                  e.preventDefault();
                  Alert.alert(
                    'Connexion requise',
                    'Vous devez vous connecter pour accéder aux services.',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Se connecter', onPress: () => navigation.navigate('Connexion') }
                    ]
                  );
                }
              }
            })}
            options={{ tabBarLabel: 'Les Services' }}
          />
          <Tab.Screen
            name="PublierService"
            component={PublierService}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => handleTabPress(e, route),
            })}
            options={{ 
              tabBarLabel: 'Publier',
            }}
          />
          <Tab.Screen
            name="Notification"
            component={Notification}
            options={{ tabBarLabel: 'Notifications' }}
          />
          <Tab.Screen
            name="Parametre"
            component={Parametre}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (route.name === 'Parametre' && (!user || !user.telephone)) {
                  e.preventDefault();
                  Alert.alert(
                    'Connexion requise',
                    'Vous devez vous connecter pour accéder aux paramètres.',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Se connecter', onPress: () => navigation.navigate('Connexion') }
                    ]
                  );
                }
              },
            })}
            options={{ tabBarLabel: 'Paramètre' }}
          />
        </Tab.Navigator>
        
        {/* Bouton flottant */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={checkAuthAndNavigate}
        >
          <Ionicons name='megaphone' size={20} color='white' style={{ transform: [{ rotate: '-45deg' }] }} />
          <Text style={styles.textbutton}>Publier un service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    paddingBottom: 5,
    paddingTop: 2,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textbutton: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginTop: 30,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
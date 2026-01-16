import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Menu from '../screens/menu';
import Parametre from '../screens/parametre';
import Notification from '../screens/notification';
import ListeService from '../screens/liste-service';
import PublierService from '../screens/publier-service';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from './GlobalUser';

const Tab = createBottomTabNavigator();

// Composants de boutons personnalisés
const MenuTabButton = ({ color, size, focused }) => (
  <Ionicons 
    name={focused ? 'home' : 'home-outline'} 
    size={25} 
    color={color} 
  />
);

const ListeServiceTabButton = ({ color, size, focused }) => (
  <Ionicons 
    name={focused ? 'calendar' : 'calendar-outline'} 
    size={25} 
    color={color} 
  />
);



const NotificationTabButton = ({ color, size, focused }) => (
  <Ionicons 
    name={focused ? 'notifications' : 'notifications-outline'} 
    size={25} 
    color={color} 
  />
);

const ParametreTabButton = ({ color, size, focused }) => (
  <Ionicons 
    name={focused ? 'settings' : 'settings-outline'} 
    size={25} 
    color={color} 
  />
);

// Composant Header séparé
const CustomHeader = () => {
  const { user } = useContext(GlobalContext);
  
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {user && user.nom_prenom ? user.nom_prenom : 'Invité'} 
      </Text>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default function BottomClient() {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();

  // Fonctions de vérification d'authentification pour chaque écran
  const checkAuthForListeService = (e) => {
    if (!user || !user.telephone) {
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
  };

  const checkAuthForPublierService = (e) => {
    e.preventDefault();
    if (user && user.telephone) {
      navigation.navigate('PublierService');
    } else {
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

  const checkAuthForParametre = (e) => {
    if (!user || !user.telephone) {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomHeader />
        
        <Tab.Navigator 
          initialRouteName='Menu'
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        >
          {/* Écran Menu */}
          <Tab.Screen
            name="Menu"
            component={Menu}
            options={{
              tabBarLabel: 'Menu',
              tabBarIcon: ({ color, size, focused }) => (
                <MenuTabButton color={color} size={size} focused={focused} />
              ),
              tabBarLabelStyle:{
                fontSize: 12,
                fontWeight: '500',
              
              }
            }}
          />

          {/* Écran ListeService */}
          <Tab.Screen
            name="ListeService"
            component={ListeService}
            listeners={{
              tabPress: checkAuthForListeService
            }}
            options={{
              tabBarLabel: 'Mes Reservations',
              tabBarIcon: ({ color, size, focused }) => (
                <ListeServiceTabButton color={color} size={size} focused={focused} />
              ),
              tabBarLabelStyle:{
                fontSize: 10,
                fontWeight: '500',
              }
            }}
          />

       

          {/* Écran Notification */}
          <Tab.Screen
            name="Notification"
            component={Notification}
            options={{
              tabBarLabel: 'Notifications',
              tabBarIcon: ({ color, size, focused }) => (
                <NotificationTabButton color={color} size={size} focused={focused} />
              ),
            }}
          />

          {/* Écran Parametre */}
          <Tab.Screen
            name="Parametre"
            component={Parametre}
            listeners={{
              tabPress: checkAuthForParametre
            }}
            options={{
              tabBarLabel: 'Paramètre',
              tabBarIcon: ({ color, size, focused }) => (
                <ParametreTabButton color={color} size={size} focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBarStyle: {
    height: 80,
    paddingBottom: 5,
    paddingTop: 2,
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
  },
 
});
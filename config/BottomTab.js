import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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

// Composant pour les boutons de connexion/inscription
const AuthButtons = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.authButtonsContainer}>
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => navigation.navigate('Connexion')}
      >
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.signupButton}
        onPress={() => navigation.navigate('Inscription')}
      >
        <Text style={styles.signupButtonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function BottomTab() {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();

  // Si l'utilisateur est connecté, afficher la tab navigation normale
  if (user && user.telephone) {
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
                  <Ionicons 
                    name={focused ? 'home' : 'home-outline'} 
                    size={25} 
                    color={color} 
                  />
                ),
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '500',
                }
              }}
            />

            {/* Écran ListeService */}
            <Tab.Screen
              name="ListeService"
              component={ListeService}
              options={{
                tabBarLabel: 'Mes commandes',
                tabBarIcon: ({ color, size, focused }) => (
                  <Ionicons 
                    name={focused ? 'briefcase' : 'briefcase-outline'} 
                    size={25} 
                    color={color} 
                  />
                ),
                tabBarLabelStyle: {
                  fontSize: 10,
                  fontWeight: '500',
                }
              }}
            />

            {/* Écran PublierService */}
            <Tab.Screen
              name="PublierService"
              component={PublierService}
              options={{
                tabBarLabel: 'Publier',
                tabBarIcon: ({ focused }) => (
                  <View style={[
                    styles.bouttonPublierContainer,
                    focused && styles.bouttonPublierFocused
                  ]}>
                    <Ionicons 
                      name={focused ? 'add' : 'add-outline'}
                      size={30}
                      color={focused ? '#fff' : '#fff'}
                    />
                  </View>
                ),
              }}
            />

            {/* Écran Notification */}
            <Tab.Screen
              name="Notification"
              component={Notification}
              options={{
                tabBarLabel: 'Notifications',
                tabBarIcon: ({ color, size, focused }) => (
                  <Ionicons 
                    name={focused ? 'notifications' : 'notifications-outline'} 
                    size={25} 
                    color={color} 
                  />
                ),
              }}
            />

            {/* Écran Parametre */}
            <Tab.Screen
              name="Parametre"
              component={Parametre}
              options={{
                tabBarLabel: 'Paramètre',
                tabBarIcon: ({ color, size, focused }) => (
                  <Ionicons 
                    name={focused ? 'settings' : 'settings-outline'} 
                    size={25} 
                    color={color} 
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </View>
      </SafeAreaView>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher les boutons de connexion
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomHeader />
        
        {/* Afficher l'écran Menu pour les non-connectés */}
        <View style={styles.mainContent}>
          <Menu />
        </View>
        
        {/* Afficher les boutons de connexion/inscription en bas */}
        <AuthButtons />
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
  mainContent: {
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
  bouttonPublierContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 42,
    color: '#fff',
  },
  bouttonPublierFocused: {
    backgroundColor: '#f7f3f3',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    gap: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 38,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../screens/menu';
import BottomTab from './BottomTab';
import Connexion from '../screens/connexion';
import ListeService from '../screens/liste-service';
import PublierService from '../screens/publier-service';
import PlusService from '../screens/plus-service';
import ServiceUtilisateur from '../screens/service-utilisateur';
import BottomClient from './BottomClient';
import Inscription from '../screens/inscription';
import CommandeRecu from '../screens/commande-recu';
import CommandeClient from '../screens/commande-client';

const Stak = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
        <Stak.Navigator initialRouteName='BottomTab'>
            <Stak.Screen name='Menu' component={Menu} 
            options={{ headerShown: false }} />
            <Stak.Screen name='BottomTab' component={BottomTab} 
            options={{ headerShown: false }} />
            <Stak.Screen name='Connexion' component={Connexion} 
            options={{ headerShown: false }} />
            <Stak.Screen name='ListeService' component={ListeService} />
            <Stak.Screen name='PublierService' component={PublierService} />
            <Stak.Screen name='PlusService' component={PlusService} 
            options={{headerShown: false}}
            />
            <Stak.Screen name='ServiceUtilisateur' component={ServiceUtilisateur} />
            <Stak.Screen name='BottomClient' component={BottomClient} options={{ headerShown: false }} />
            <Stak.Screen name='Inscription' component={Inscription} options={{ headerShown: false }} />
            <Stak.Screen name='CommandeRecu' component={CommandeRecu} />
            <Stak.Screen name='CommandeClient' component={CommandeClient} />
        </Stak.Navigator>
    </NavigationContainer>
  )
}
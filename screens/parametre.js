import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../config/GlobalUser';
import { useNavigation } from '@react-navigation/native';

export default function Parametres() {
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();
  
  const handleDeconnexion = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Se déconnecter', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Connexion' }],
            });
          }
        }
      ]
    );
  };

  const options = [
    { icon: 'person-outline', title: 'Profil', onPress: () => navigation.navigate('Profil') },
    { icon: 'wallet-outline', title: 'Rechargement', onPress: () => navigation.navigate('Rechargement') },
    { icon: 'help-circle-outline', title: 'Aide', onPress: () => navigation.navigate('Aide') },
    { icon: 'chatbubble-outline', title: 'Nous contacter', onPress: () => navigation.navigate('Contact') },
  ];

  return (
    <View style={styles.container}>
      {/* Profil */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nom?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.nom_prenom || 'Utilisateur'}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.email || 'email@exemple.com'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('Profil')}
        >
          <Ionicons name="create-outline" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View style={styles.optionsCard}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionItem,
              index === options.length - 1 && styles.lastOptionItem
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={option.icon} size={22} color="#2E7D32" />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7A8C7A" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Déconnexion */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleDeconnexion}
      >
        <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8',
    padding: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7A8C7A',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginLeft: 10,
  },
  versionText: {
    fontSize: 14,
    color: '#7A8C7A',
    textAlign: 'center',
  },
});
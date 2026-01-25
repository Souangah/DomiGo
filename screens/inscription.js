import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

const Inscription = ({navigation}) => {
  const [nom_prenom, setNom_Prenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('client');
  const [ville, setVille] = useState('');

  const Valider = async () => {
    if (!nom_prenom.trim()  || !telephone.trim() || !mdp.trim() || !ville.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (mdp.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const formData = new FormData();
    formData.append('nom_prenom', nom_prenom);
    formData.append('telephone', telephone);
    formData.append('mdp', mdp);
    formData.append('role', role);
    formData.append('ville', ville);

    try {
      const response = await fetch('https://epencia.net/app/souangah/domigo/inscription.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        Alert.alert('Succès', result.message, [
          { text: 'OK', onPress: () => navigation.navigate('Connexion') }
        ]);
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Problème de connexion');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>DomiGo</Text>
        <Text style={styles.subtitle}>Créez votre compte</Text>
      </View>

      {/* Formulaire */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom & Prénoms"
          value={nom_prenom}
          onChangeText={setNom_Prenom}
        />

        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          value={telephone}
          onChangeText={setTelephone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe (min. 6 caractères)"
          value={mdp}
          onChangeText={setMdp}
          secureTextEntry
        />

        {/* Choix du rôle */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'client' && styles.roleButtonSelected]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.roleText, role === 'client' && styles.roleTextSelected]}>
              Client
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'prestataire' && styles.roleButtonSelected]}
            onPress={() => setRole('prestataire')}
          >
            <Text style={[styles.roleText, role === 'prestataire' && styles.roleTextSelected]}>
              Prestataire
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ville/Commune"
          value={ville}
          onChangeText={setVille}
        />

        <TouchableOpacity style={styles.button} onPress={Valider}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

      {/* Lien vers connexion */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
          <Text style={styles.footerLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8', // Fond vert très clair
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2E7D32', // Vert foncé
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50', // Vert moyen
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#C8E6C9', // Bordure vert pâle
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    color: '#2E7D32', // Texte vert foncé
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  roleButtonSelected: {
    backgroundColor: '#2E7D32', // Vert foncé
    borderColor: '#2E7D32',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  roleTextSelected: {
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2E7D32', // Vert foncé
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 15,
    color: '#7A8C7A', // Vert grisâtre
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#388E3C', // Vert légèrement plus foncé
  },
});

export default Inscription;
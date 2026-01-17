import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Inscription = () => {
  // États pour les champs du formulaire
  const [nom_prenom, setNom_Prenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('client');
  const [ville, setVille] = useState('');
  
  // États pour la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const Valider = async () => {
    // Validation des champs
    if (!nom_prenom.trim()  || !telephone.trim() || !mdp.trim() || !ville.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
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

    const response = await fetch('https://epencia.net/app/souangah/domigo/inscription.php',{
        method: 'POST',
        body: formData,
    });
    const result = await response.json();

    if (result=== 'Inscription effectuée avec succès') {
      Alert.alert('Succès', result);
        resetForm();
      navigation.navigate('Connexion');
    } else {
      Alert.alert('Erreur', result.message || 'Échec de l\'inscription. Veuillez réessayer.');
    }

  };

  const resetForm = () => {
    setNom_Prenom('');
    setTelephone('');
    setMdp('');
    setRole('client');
    setVille('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>Créez votre compte</Text>
          </View>

          <View style={styles.form}>
            {/* Nom */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom & Prenoms *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nom"
                value={nom_prenom}
                onChangeText={setNom_Prenom}
                autoCapitalize="words"
              />
            </View>

            {/* Téléphone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre numéro"
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Créez un mot de passe"
                  value={mdp}
                  onChangeText={setMdp}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>Minimum 6 caractères</Text>
            </View>

            {/* Rôle (Client ou Prestataire) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vous êtes *</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'client' && styles.roleButtonSelected,
                  ]}
                  onPress={() => setRole('client')}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === 'client' && styles.roleTextSelected,
                    ]}
                  >
                    Client
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'prestataire' && styles.roleButtonSelected,
                  ]}
                  onPress={() => setRole('prestataire')}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === 'prestataire' && styles.roleTextSelected,
                    ]}
                  >
                    Prestataire
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ville/Commune */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ville/Commune *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre ville ou commune"
                value={ville}
                onChangeText={setVille}
                autoCapitalize="words"
              />
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity style={styles.submitButton} onPress={Valider}>
              <Text style={styles.submitButtonText}>S'inscrire</Text>
            </TouchableOpacity>

            {/* Informations légales */}
            <View style={styles.legalTextContainer}>
              <Text style={styles.legalText}>
                En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  eyeButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  roleTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  legalTextContainer: {
    marginTop: 20,
    padding: 10,
  },
  legalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default Inscription;
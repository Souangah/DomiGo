import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Keyboard } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../config/GlobalUser';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function PublierService() {
  const [code_categorie, setCode_categorie] = useState('');
  const [nom_categorie, setNom_categorie] = useState('');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await fetch('https://epencia.net/app/souangah/domigo/liste-categorie-service.php');
      const result = await response.json();
      setCategories(result);
     
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      Alert.alert('Erreur', 'Impossible de charger les catégories');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre galerie.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const validateForm = () => {
    if (!titre.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une description');
      return false;
    }
    if (!prix.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un prix');
      return false;
    }
    if (!code_categorie) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return false;
    }
    if (!user || !user.user_id) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return false;
    }
    return true;
  };

  const publierService = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('code_categorie', code_categorie);
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('user_id', user.user_id);

    if (photo) {
      const fileName = photo.split('/').pop();
      const mimeType = photo.endsWith('.jpg') || photo.endsWith('.jpeg') 
        ? 'image/jpeg' 
        : photo.endsWith('.png') 
          ? 'image/png' 
          : 'image/jpeg';

      formData.append('photo', {
        uri: photo,
        type: mimeType,
        name: fileName || 'photo.jpg',
      });
    }

    try {
      console.log('Envoi des données...', {
        code_categorie,
        titre,
        description,
        prix,
        user_id: user.user_id,
        hasPhoto: !!photo
      });

      const response = await fetch('https://epencia.net/app/souangah/domigo/publier-service.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Réponse reçue, statut:', response.status);
      const result = await response.json();
      console.log('Résultat JSON:', result);
      
      if (result.success) {
        Alert.alert(
          'Succès', 
          result.message || 'Service publié avec succès',
          [
            {
              text: 'OK',
              onPress: () => {
                setTitre('');
                setDescription('');
                setPrix('');
                setPhoto(null);
                if (categories.length > 0) {
                  setCode_categorie(categories[0].code_categorie);
                  setNom_categorie(categories[0].nom_categorie);
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Erreur', result.message || "Erreur lors de la publication du service");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      Alert.alert('Erreur', 'Impossible de publier le service. Vérifiez votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Publier un service</Text>
      
      <Text style={styles.label}>Titre *</Text>
      <TextInput
        style={styles.input}
        placeholder='Entrer le titre du service'
        placeholderTextColor="#999"
        value={titre}
        onChangeText={setTitre}
        maxLength={100}
        editable={!isLoading}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder='Décrivez votre service en détail...'
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        maxLength={500}
        editable={!isLoading}
      />

      <Text style={styles.label}>Prix *</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: 5000 FCFA'
        placeholderTextColor="#999"
        value={prix}
        onChangeText={setPrix}
        keyboardType="decimal-pad"
        editable={!isLoading}
      />

      <Text style={styles.label}>Catégorie *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={code_categorie}
          onValueChange={(value) => {
            setCode_categorie(value);
            const cat = categories.find(c => c.code_categorie === value);
            setNom_categorie(cat?.nom_categorie || '');
          }}
          style={styles.picker}
          enabled={!isLoading}
        >
          <Picker.Item
            label="Sélectionner une catégorie"
            value=""
            color="#999"
          />
          {categories.map((item) => (
            <Picker.Item
              key={item.code_categorie}
              label={item.nom_categorie}
              value={item.code_categorie}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Photo (optionnelle)</Text>
      
      {photo ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.image} />
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity 
              style={[styles.changePhotoButton, isLoading && styles.buttonDisabled]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Text style={styles.changePhotoText}>Changer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.removePhotoButton, isLoading && styles.buttonDisabled]}
              onPress={() => setPhoto(null)}
              disabled={isLoading}
            >
              <Text style={styles.removePhotoText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.photoButton, isLoading && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.photoButtonText}>📷 Ajouter une photo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.publishButton, isLoading && styles.buttonDisabled]}
        onPress={publierService}
        disabled={isLoading}
      >
        <Text style={styles.publishButtonText}>
          {isLoading ? 'Publication en cours...' : 'Publier le service'}
        </Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Publication en cours...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginBottom: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#ebf5fb',
  },
  photoButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  changePhotoButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changePhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  removePhotoButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  removePhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  publishButton: {
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
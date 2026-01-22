import { View, Text, ScrollView, Image, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../config/GlobalUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Obtenir la largeur de l'écran
const { width } = Dimensions.get('window');

export default function Menu() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const {user, setUser} = useContext(GlobalContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getService(), getCategorie()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getService = async () => {
    try {
      setError(null);
      
      const response = await fetch('https://epencia.net/app/souangah/domigo/liste-service.php');
      const result = await response.json();
      setServices(result);
      setFilteredServices(result);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      setError(error.message);
      setServices([]);
      setFilteredServices([]);
    }
  };

  const getCategorie = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('https://epencia.net/app/souangah/domigo/liste-categorie-service.php');  
      const result = await response.json();
      setCategories(result);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // valider la commande
  const Commander = async (item) => {
    if (!user || !user.user_id) {
      Alert.alert(
        'Erreur', 
        'veillez vous connecter pour passer une commande.',
        [
          { text: 'annuler', style:'cancel'},
          {text: 'Se connecter', onPress: () => navigation.navigate('Connexion')}
        ]
      );
      return;
    }

    Alert.alert(
      'Confirmer la commande',
      `Voulez-vous commander le service "${item.nom_prenom || 'ce service'} ?\n\nPrix: ${item.prix || '0'} FCFA`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            createCommande(item);
            navigation.navigate('CommandeClient');
          },
          
        }
        
      ]
    );
  };

  const createCommande = async (item) => {
    try {
     

      const formData = new FormData();
      formData.append('code_service', item.code_service);
      formData.append('user_id', user.user_id);
      formData.append('prix', item.prix || 0);

      const response = await fetch('https://epencia.net/app/souangah/domigo/nouvelle-commande.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        Alert.alert(
          'Succès',
          'Commande passée avec succès!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Erreur',
          result.message || 'Erreur lors de la commande',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erreur création commande:', error);
      Alert.alert(
        'Erreur',
        'Impossible de créer la commande. Vérifiez votre connexion.',
        [{ text: 'OK' }]
      );
    }
  };

  // Fonction pour filtrer les services par catégorie
  const filterServicesByCategory = (categoryCode) => {
    if (selectedCategory === categoryCode) {
      setSelectedCategory(null);
      setFilteredServices(services);
    } else {
      setSelectedCategory(categoryCode);
      const filtered = services.filter(service => 
        service.code_categorie === categoryCode
      );
      setFilteredServices(filtered);
    }
  };

  // Filtrage automatique des services en fonction du texte de recherche ET de la catégorie
  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory) {
      filtered = filtered.filter(service => 
        service.code_categorie === selectedCategory
      );
    }
    
    if (searchText.trim()) {
      filtered = filtered.filter(service => {
        const titre = service.titre || '';
        const description = service.description || '';
        const searchLower = searchText.toLowerCase();
        
        return titre.toLowerCase().includes(searchLower) ||
               description.toLowerCase().includes(searchLower);
      });
    }
    
    setFilteredServices(filtered);
  }, [searchText, services, selectedCategory]);

  // Fonction pour générer des notes aléatoires
  const generateRating = () => {
    const ratings = ["4.5", "4.9", "4.7", "4.3", "4.8", "5.0", "4.2"];
    const reviews = ["(120 avis)", "(210 avis)", "(165 avis)", "(89 avis)", "(312 avis)", "(45 avis)", "(178 avis)"];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return `${ratings[randomIndex]} ${reviews[randomIndex]}`;
  };

  const renderCategorie = ({ item }) => {
    const isSelected = selectedCategory === item.code_categorie;
    
    return (
      <TouchableOpacity 
        style={[
          styles.categorieName, 
          isSelected && styles.selectedCategorieName
        ]}
        onPress={() => filterServicesByCategory(item.code_categorie)}
      >
        <Text style={[
          styles.categorieText,
          isSelected && styles.selectedCategorieText
        ]}>
          {item.nom_categorie || 'Catégorie'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Rendu d'un service horizontal
  const renderHorizontalService = ({ item }) => {
    const rating = generateRating();

    return (
      <TouchableOpacity style={styles.horizontalServiceCard}>
        {/* Image du service */}
        <View style={styles.imagecontainer}>
        {item.photo64 ? (
          <Image 
            source={{ uri: `data:${item.type_photo || 'image/jpeg'};base64,${item.photo64}` }} 
            style={styles.horizontalServiceImage}
            resizeMode="cover"
          />
          
        ) : (
          <View style={styles.horizontalServiceImagePlaceholder}>
            <Ionicons name="construct" size={32} color="#666" />
          </View>
        )}

        <View style={styles.categorieBadge}>
          <Text style={styles.categorieBadgeText}>
            {item.nom_categorie || 'Catégorie'}
          </Text>
        </View>
        </View>

        {/* Contenu du service */}
        <View style={styles.horizontalServiceContent}>
          <Text style={styles.horizontalServiceTitle} numberOfLines={2}>
            {item.nom_prenom || 'Service sans nom'}
          </Text>
          
          <Text style={styles.horizontalServiceDescription} numberOfLines={2}>
            {item.description || 'Aucune description'}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.horizontalServicePrice}>
              {item.prix || '0'} FCFA
            </Text>
          </View>
          
          <View style={styles.horizontalRatingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={styles.horizontalRatingText}>{rating}</Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.horizontalActionButtons}>
            <TouchableOpacity style={styles.viewProfileButtonHorizontal}
            onPress={() => {
              setSelectedService(item)
              setModalVisible(true)
            }}
            >
              <Text style={styles.viewProfileButtonTextHorizontal}>Voir Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bookNowButtonHorizontal}
              onPress={() => Commander(item)}
            >
              <Text style={styles.bookNowButtonTextHorizontal}>Commander</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement des services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un service..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Afficher les erreurs si présentes */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={getService}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bannière promotionnelle */}
        <View style={styles.promoBanner}>
         <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Livraison Rapide & Sécurisée</Text>
            <Text style={styles.promoSubtitle}>
              Recevez vos commandes à domicile en un temps record
            </Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Commander maintenant</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.promoImageContainer}>
            <View style={styles.promoImage}>
              <Ionicons name="bicycle-outline" size={40} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Section "Catégories services" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories services</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => {
              setSelectedCategory(null);
              setFilteredServices(services);
            }}>
              <Text style={styles.viewAllText}>Tout afficher</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des catégories */}
        {categoriesLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Chargement des catégories...</Text>
          </View>
        ) : categories.length === 0 ? (
          <Text style={styles.emptyText}>Aucune catégorie disponible</Text>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.code_categorie?.toString() || Math.random().toString()}
            renderItem={renderCategorie}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categorieListe}
          />
        )}

        {/* Modal pour afficher les détails du service */}
        <Modal 
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              
              {/* Affiche de la photo */}
              {selectedService?.photo64 ? (
                <Image
                  source={{uri: `data:${selectedService.type_photo || 'image/jpeg'};base64,${selectedService.photo64}`}}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Ionicons name="construct" size={40} color="#666" />
                </View>
              )}
              
              {/* Informations du service */}
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedService?.titre || 'Titre non disponible'}
              </Text>
              
              <Text style={styles.modalPrice}>
                {selectedService?.prix || '0'} FCFA
              </Text>
              
              <Text style={styles.modalDescription} numberOfLines={6}>
                {selectedService?.description || 'Aucune description disponible'}
              </Text>
              
              {/* Bouton Commander et Fermer */}
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity 
                  style={styles.modalCommanderButton}
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                      if (selectedService) Commander(selectedService);
                    }, 300);
                  }}
                >
                  <Text style={styles.modalCommanderButtonText}>Commander</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                  <Text style={styles.modalCloseButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Indicateur de catégorie sélectionnée */}
        {selectedCategory && (
          <View style={styles.selectedCategoryContainer}>
            <Text style={styles.selectedCategoryText}>
              Catégorie sélectionnée: {
                categories.find(cat => cat.code_categorie === selectedCategory)?.nom_categorie || 'Inconnue'
              }
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => {
                setSelectedCategory(null);
                setFilteredServices(services);
              }}
            >
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Section "Tous les Services" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? 'Services de la catégorie' : 'Tous les Services'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlusService')}>
            <Text style={styles.viewAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des services */}
        {filteredServices.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {selectedCategory 
                ? `Aucun service dans cette catégorie${searchText ? ` pour "${searchText}"` : ''}`
                : searchText 
                  ? `Aucun service trouvé pour "${searchText}"`
                  : 'Aucun service disponible'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.horizontalServicesContainer}>
            <FlatList
              data={filteredServices}
              renderItem={renderHorizontalService}
              keyExtractor={(item, index) => item.code_service?.toString() || index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={220 + 15}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    padding: 0,
  },
  promoBanner: {
    backgroundColor: '#4A6FFF',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
    paddingRight: 10,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#4A6FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  promoImageContainer: {
    width: 80,
    height: 80,
  },
  promoImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  categorieListe: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingBottom: 10,
  },
  categorieName: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategorieName: {
    backgroundColor: '#4A6FFF',
  },
  categorieText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategorieText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  selectedCategoryText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  clearFilterButton: {
    padding: 5,
  },
  // Styles pour les services horizontaux
  horizontalServicesContainer: {
    marginBottom: 20,
    height: 350,
  },
  horizontalScrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  horizontalServiceCard: {
    width: 220,
    height: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  horizontalServiceImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
  },
  horizontalServiceImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalServiceContent: {
    padding: 12,
  },
  horizontalServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 8,
  },
  horizontalServicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  horizontalServiceDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  horizontalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  horizontalRatingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  horizontalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  viewProfileButtonHorizontal: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewProfileButtonTextHorizontal: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  bookNowButtonHorizontal: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookNowButtonTextHorizontal: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  
  // Styles pour le modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
 
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalPrice: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#4CAF50', 
    textAlign: 'center', 
    marginBottom: 16,
  },
  modalDescription: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center', 
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  modalCommanderButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCommanderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalCloseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalCloseButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagecontainer:{
    position: 'relative',
  },
  categorieBadge:{ 
    position: 'absolute',
    top: 8,
    right: 8,
  
  },
  categorieBadgeText:{
    backgroundColor: 'rgba(255, 7, 7, 0.6)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
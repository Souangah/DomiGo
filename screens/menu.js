import { View, Text, ScrollView, Image, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'; // Si vous utilisez Expo
// Sinon, installez react-native-vector-icons et importez depuis 'react-native-vector-icons/Ionicons'

// Obtenir la largeur de l'écran
const { width } = Dimensions.get('window');

export default function Menu() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://epencia.net/app/souangah/domigo/liste-service.php');
      
      const result = await response.json();
      setServices(result);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Services les plus populaires (statiques pour l'exemple)
  const popularServices = [
    { id: '1', title: 'Plombier', icon: '⚙️' },
    { id: '2', title: 'Électricien', icon: '⚡' },
    { id: '3', title: 'Menuisier', icon: '🔨' },
    { id: '4', title: 'Peintre', icon: '🎨' },
    { id: '5', title: 'Maçon', icon: '🧱' },
    { id: '6', title: 'Soudeur', icon: '🔥' },
    { id: '7', title: 'Couvreur', icon: '🏠' },
    { id: '8', title: 'Plus', icon: '⋯' },
  ];

  // Fonction pour générer un prix aléatoire
  const generatePrice = () => {
    const prices = ["45€", "40€/jour", "55€/session", "35€/jour", "60€", "50€/heure", "70€"];
    return prices[Math.floor(Math.random() * prices.length)];
  };

  // Fonction pour générer des notes aléatoires
  const generateRating = () => {
    const ratings = ["4.5", "4.9", "4.7", "4.3", "4.8", "5.0", "4.2"];
    const reviews = ["(120 avis)", "(210 avis)", "(165 avis)", "(89 avis)", "(312 avis)", "(45 avis)", "(178 avis)"];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return `${ratings[randomIndex]} ${reviews[randomIndex]}`;
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.serviceTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPopularService = ({ item }) => (
    <TouchableOpacity style={styles.popularServiceCard}>
      <View style={styles.popularIconContainer}>
        <Text style={styles.popularIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.popularServiceTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Rendu d'un service horizontal
  const renderHorizontalService = ({ item, index }) => {
    const price = generatePrice();
    const rating = generateRating();

    return (
      <TouchableOpacity style={styles.horizontalServiceCard}>
        {/* Image du service */}
        {item.photo64 ? (
          <Image 
            source={{ uri: `data:${item.type_photo || 'image/jpeg'};base64,${item.photo64}` }} 
            style={styles.horizontalServiceImage}
          />
        ) : (
          <View style={styles.horizontalServiceImagePlaceholder}>
            <Text style={styles.horizontalServiceIcon}>🔧</Text>
          </View>
        )}

        {/* Contenu du service */}
        <View style={styles.horizontalServiceContent}>
          <Text style={styles.horizontalServiceTitle} numberOfLines={1}>
            {item.titre || 'Service sans nom'}
          </Text>
          
          <Text style={styles.horizontalServicePrice}>{item.prix}</Text>
          <Text style={styles.horizontalServiceDescription}>{item.description || 'Acune description'}</Text>
          
          <View style={styles.horizontalRatingContainer}>
            <Text style={styles.horizontalRatingIcon}>⭐</Text>
            <Text style={styles.horizontalRatingText}>{rating}</Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.horizontalActionButtons}>
            <TouchableOpacity style={styles.viewProfileButtonHorizontal}>
              <Text style={styles.viewProfileButtonTextHorizontal}>Voir Profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookNowButtonHorizontal}>
              <Text style={styles.bookNowButtonTextHorizontal}>Réserver</Text>
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getService}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
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
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un service..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Bannière promotionnelle */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Économisez 25% Aujourd'hui !</Text>
            <Text style={styles.promoSubtitle}>Remises exclusives sur les services à domicile</Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Réserver Maintenant</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoImageContainer}>
            <View style={styles.promoImage}>
              <Text style={styles.promoImageText}>🏠</Text>
            </View>
          </View>
        </View>

        {/* Section "Services les Plus Réservés" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services les Plus Réservés</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des services populaires */}
        <FlatList
          data={popularServices}
          renderItem={renderPopularService}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularServicesList}
        />

        {/* Section "Tous les Services" avec ScrollView horizontal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tous les Services</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView horizontal pour tous les services */}
        {services.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Aucun service disponible</Text>
          </View>
        ) : (
          <View style={styles.horizontalServicesContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {services.map((item, index) => (
                <View key={item.code_service || index}>
                  {renderHorizontalService({ item, index })}
                </View>
              ))}
            </ScrollView>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  searchIcon: {
    fontSize: 18,
    color: '#666',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    fontSize: 22,
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
  promoImageText: {
    fontSize: 40,
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
  popularServicesList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  popularServiceCard: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  popularIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularIcon: {
    fontSize: 24,
  },
  popularServiceTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Styles pour les services horizontaux
  horizontalServicesContainer: {
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  horizontalServiceCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalServiceImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  horizontalServiceImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalServiceIcon: {
    fontSize: 40,
    color: '#666',
  },
  horizontalServiceContent: {
    padding: 15,
  },
  horizontalServiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  horizontalServicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  horizontalServiceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  horizontalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  horizontalRatingIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  horizontalRatingText: {
    fontSize: 14,
    color: '#666',
  },
  horizontalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewProfileButtonHorizontal: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  viewProfileButtonTextHorizontal: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  bookNowButtonHorizontal: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookNowButtonTextHorizontal: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
  },
});
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function PlusService() {

  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [ModalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      const response = await fetch(
        'https://epencia.net/app/souangah/domigo/liste-service.php'
      );
      const result = await response.json();
      setServices(result);
      setFilteredServices
    } catch (error) {
      console.log('Erreur chargement services', error);
    }
  };


  // Filtrer les services en fonction du texte de recherche
  useEffect(() => {
    const filtered = services.filter((item) =>
    item.titre?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase()) || 
    item.prix?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [services, searchText]);


// recuperer les services
  const renderService = ({ item }) => {
    return (
      <View style={styles.card}>
        {item.photo64 ? (
          <Image
            source={{
              uri: `data:${item.type_photo || 'image/jpeg'};base64,${item.photo64}`
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="construct" size={28} color="#666" />
          </View>
        )}

        <Text style={styles.titre} numberOfLines={1}>
          {item.nom_prenom || 'Service disponible'}
        </Text>
         <Text style={styles.description} numberOfLines={2}>
          {item.description || ''}
        </Text>
       
        <Text style={styles.prix} numberOfLines={1}>
          {item.prix ? `${item.prix} FCFA` : 'Prix non spécifié'}
        </Text>
       

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => {setSelectedService(item)
                setModalVisible(true)
            }}
            
          >
            <Text style={styles.detailButtonText}>Détail</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.reserverButton}
            onPress={() => handleReserver(item)}
          >
            <Text style={styles.reserverButtonText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Tous les Services</Text>
        </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.inputSearch}
          placeholder="Rechercher un service"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.code_service}
        renderItem={renderService}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      <Modal
      visible={ModalVisible}
      animationType='slide'
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>

                {/*affiche de la photo */}
                {selectedService?.photo64 ? (
                  <Image
                    source={{
                      uri: `data:${selectedService.type_photo || 'image/jpeg'};base64,${selectedService.photo64}`
                    }}
                    style={styles.modalImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="construct" size={28} color="#666" />
                  </View>
                )}
                    {/* Details du service */}
                <Text style={styles.modalTitle}>{selectedService?.nom_prenom}</Text>
                <Text style={styles.modalDescription}>{selectedService?.description}</Text>
                <Text style={styles.modalPrice}>{selectedService?.prix} FCFA</Text>

                 {/* boutton fermer*/}
                <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                >
                <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 10,
  },
  header:{
    paddingHorizontal: 20,
    paddingVertical:15,
    marginTop: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
  },
    headerTitle:{ 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#000000'
     },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
    elevation: 2,
  },
  inputSearch: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    elevation: 3,
    marginBottom: 12,
    width: '48%',
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginBottom: 6,
  },
  imagePlaceholder: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  titre: {
    fontSize: 15,
    color: '#010101',
    marginBottom: 2,
    textAlign: 'center',
  },
  nomService: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  prix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A6FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 11,
    color: '#777',
    marginBottom: 8,
    textAlign: 'center',
    height: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  detailButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#555',
    fontSize: 11,
    fontWeight: '500',
  },
  reserverButton: {
    backgroundColor: '#4A6FFF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
    alignItems: 'center',
  },
  reserverButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  elevation: 5,
},

modalImage: {
  width: '100%',
  height: 180,
  borderRadius: 12,
  marginBottom: 12,
},

modalTitle: { 
    fontSize: 25, 
    color: '#000000', 
    textAlign: 'center',
    fontWeight: '700',
},
modalName: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    textAlign: 'center', 
    marginVertical: 4 
},
modalPrice: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#4A6FFF', 
    textAlign: 'center', 
    margin: 6 
},
modalDescription: { 
    fontSize: 14, 
    color: '#777', 
    textAlign: 'center', 
    lineHeight: 20 },

closeButton: { 
   flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,    
},
closeButtonText: { 
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
},

imagePlaceholder: {
  width: '100%',
  height: 180,
  borderRadius: 12,
  backgroundColor: '#eee',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
},

});
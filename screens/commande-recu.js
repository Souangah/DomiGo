import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../config/GlobalUser';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function CommandeRecu() {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [activeTab, setActiveTab] = useState('toutes');
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (user?.user_id) {
      getCommandes();
    }
  }, [user]);

  useEffect(() => {
    filterCommandes();
  }, [commandes, activeTab]);

  const getCommandes = async () => {
    try {
      const response = await fetch(
        `https://epencia.net/app/souangah/domigo/commande-recu.php?user_id=${user.user_id}`
      );
      const result = await response.json();
      setCommandes(result);
    } catch (error) {
      console.log('Erreur API:', error);
    }
  };

  const filterCommandes = () => {
    let filtered = [...commandes];
    
    switch (activeTab) {
      case 'en-attente':
        filtered = commandes.filter(c => c.statut === 'En attente');
        break;
      case 'effectuees':
        filtered = commandes.filter(c => c.statut === 'Effectuée');
        break;
      case 'toutes':
      default:
        filtered = commandes;
        break;
    }
    
    setFilteredCommandes(filtered);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente':
        return '#43A047';
      case 'Effectuée':
        return '#ff0101';
      default:
        return '#666';
    }
  };

  const handleAccept = (commande) => {
    // Logique pour accepter la commande
    console.log('Accepter commande:', commande.code_commande);
  };

  const handleContact = (commande) => {
    // Logique pour contacter le client
    console.log('Contacter client:', commande.client_telephone);
  };

  const handleLocaliser = (commande) => {
    // Logique pour localiser
    console.log('Localiser commande:', commande.code_commande);
  };

  const RenderCommande = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCode}># {item.code_commande}</Text>
          <Text style={[styles.cardStatut, { color: getStatusColor(item.statut) }]}>
            {item.statut}
          </Text>
        </View>
        
        <View style={styles.cardText}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.infoText}>{item.client_nom}</Text>
        </View>
        
        <View style={styles.cardText}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.infoText}>{item.client_telephone}</Text>
        </View>
        
        <View style={styles.cardText}>
          <MaterialIcons name="design-services" size={16} color="#666" />
          <Text style={styles.infoText}>{item.titre}</Text>
        </View>
        
        <View style={styles.cardText}>
          <FontAwesome5 name="calendar-alt" size={16} color="#666" />
          <Text style={styles.infoText}>{item.date_commande} & {item.heure_commande}</Text>
        </View>
      </View>

      <View style={styles.prixcontent}>
        <Text style={styles.prixlabel}>Total:</Text>
        <Text style={styles.prixValue}>{item.prix_total} FCFA</Text>
      </View>
      
      {item.statut === 'En attente' && (
        <View style={styles.cardBottom}>
          <TouchableOpacity 
            style={styles.buttonAccept}
            onPress={() => handleAccept(item)}
          >
            <Text style={styles.buttonText}>Accepter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonContact}
            onPress={() => handleContact(item)}
          >
            <Text style={styles.buttonText}>Contacter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonLocaliser}
            onPress={() => handleLocaliser(item)}
          >
            <Text style={styles.buttonText}>Localiser</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.badge, isActive && styles.activeBadge]}>
          <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Mes commandes</Text>
      </View>
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <TabButton
            title="Toutes"
            count={commandes.length}
            isActive={activeTab === 'toutes'}
            onPress={() => setActiveTab('toutes')}
          />
          
          <TabButton
            title="En attente"
            count={commandes.filter(c => c.statut === 'En attente').length}
            isActive={activeTab === 'en-attente'}
            onPress={() => setActiveTab('en-attente')}
          />
          
          <TabButton
            title="Effectuées"
            count={commandes.filter(c => c.statut === 'Effectuée').length}
            isActive={activeTab === 'effectuees'}
            onPress={() => setActiveTab('effectuees')}
          />
        </ScrollView>
      </View>
     
      <FlatList
        data={filteredCommandes}
        keyExtractor={(item) => item.code_commande.toString()}
        renderItem={RenderCommande}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  tabsScrollContent: {
    paddingHorizontal: 15,
  },
  
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  activeTabButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  badge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 5,
  },
  
  activeBadge: {
    backgroundColor: '#fff',
  },
  
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  activeBadgeText: {
    color: '#4CAF50',
  },
  
  listContainer: {
    padding: 15,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  cardContent: {
    marginBottom: 10,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  
  cardCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  
  cardStatut: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  
  cardText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1,
  },
  
  prixcontent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  
  prixlabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  prixValue: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  
  buttonAccept: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  
  buttonContact: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  
  buttonLocaliser: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
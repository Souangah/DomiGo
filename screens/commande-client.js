import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../config/GlobalUser';
import { useNavigation } from '@react-navigation/native';

export default function CommandeClient() {

  const [listeCommandes, setListeCommandes] = useState([]);
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('En attente'); // 'Toutes', 'En attente', 'Effectuées'

  useEffect(() => {
    if (user?.user_id) {
      chargerCommandes();
    }
  }, [user]);

  const chargerCommandes = async () => {
    try {
      const response = await fetch(
        `https://epencia.net/app/souangah/domigo/commande-client.php?user_id=${user.user_id}`
      );
      const result = await response.json();
      
      setListeCommandes(result);
    } catch (error) {
      console.log('Erreur chargement commandes', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerCommandes();
    setRefreshing(false);
  };

  // Fonction pour gérer le bouton Contacter
  const handleContacter = (telephone) => {
    console.log('Contacter:', telephone);
    // Ici vous pouvez ajouter la logique pour appeler ou envoyer un message
    // Exemple: Linking.openURL(`tel:${telephone}`);
  };

  // Fonction pour gérer le bouton Payer
  const handlePayer = (commandeId, prix) => {
    console.log('Payer commande:', commandeId, 'Montant:', prix);
    // Ici vous pouvez ajouter la logique de paiement
    // navigation.navigate('Paiement', { commandeId, prix });
  };

  // Composant TabButton
  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
        {title}
      </Text>
      <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
        <Text style={[styles.countText, isActive && styles.countTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Filtrer les commandes selon l'onglet actif
  const filteredCommandes = listeCommandes.filter((item) => {
    if (activeTab === 'toutes') return true;
    if (activeTab === 'en-attente') return item.statut === 'En attente';
    if (activeTab === 'effectuees') return item.statut === 'Effectuée';
    return true;
  });

  const RenderCommande = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>#{item.code_commande}</Text>
        </View>
        <Text style={[
          styles.statusText,
          item.statut === 'En attente' && styles.statusEnAttente,
          item.statut === 'Effectuée' && styles.statusEffectuee
        ]}>
          {item.statut}
        </Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue} numberOfLines={2}>{item.titre}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prestataire</Text>
          <Text style={styles.infoValue}>{item.prestataire_nom}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>{item.prestataire_telephone}</Text>
        </View>
         <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prix</Text>
          <Text style={styles.infoValue}>{item.prix_service} FCFA</Text>
        </View>
      </View>
      
      {/* Boutons Contacter et Payer */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.contacterButton}
          onPress={() => handleContacter(item.prestataire_telephone)}
        >
          <Text style={styles.contacterButtonText}>Contacter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.payerButton}
          onPress={() => handlePayer(item.code_commande, item.prix_service)}
        >
          <Text style={styles.payerButtonText}>Payer</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>{item.date_commande}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.dateIcon}>⏰</Text>
          <Text style={styles.dateText}>{item.heure_commande}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Onglets - Remplacement de ScrollView par View */}
      <View style={styles.tabsContainer}>
        <TabButton
          title="Toutes"
          count={listeCommandes.length}
          isActive={activeTab === 'toutes'}
          onPress={() => setActiveTab('toutes')}
        />
        
        <TabButton
          title="En attente"
          count={listeCommandes.filter(c => c.statut === 'En attente').length}
          isActive={activeTab === 'en-attente'}
          onPress={() => setActiveTab('en-attente')}
        />
        
        <TabButton
          title="Effectuées"
          count={listeCommandes.filter(c => c.statut === 'Effectuée').length}
          isActive={activeTab === 'effectuees'}
          onPress={() => setActiveTab('effectuees')}
        />
      </View>
      
      <FlatList
        data={filteredCommandes}
        keyExtractor={(item) => item.code_commande.toString()}
        renderItem={RenderCommande}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
            <Text style={styles.emptySubText}>
              Vos commandes apparaîtront ici
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Styles pour les onglets
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center', // Centre les boutons
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#4F46E5',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: '#3730A3',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 14,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  // Styles existants
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1, // Important pour le comportement de FlatList
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    
    // Ombre améliorée
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusEnAttente: {
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  statusEffectuee: {
    color: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  infoSection: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  // Nouveaux styles pour les boutons
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  contacterButton: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contacterButtonText: {
    color: '#0EA5E9',
    fontSize: 14,
    fontWeight: '600',
  },
  payerButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateIcon: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
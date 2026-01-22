import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../config/GlobalUser';
import { useNavigation } from '@react-navigation/native';

export default function CommandeClient() {

  const [listeCommandes, setListeCommandes] = useState([]);
  const { user } = useContext(GlobalContext);
  const navigation = useNavigation();

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
      console.log('COMMANDES CLIENT :', result);
      setListeCommandes(result);
    } catch (error) {
      console.log('Erreur chargement commandes', error);
    }
  };

  const renderCommande = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titre}>Commande #{item.code_commande}</Text>
      <Text>Service : {item.titre}</Text>
      <Text>Prix : {item.prix_total} FCFA</Text>
      <Text>Statut : {item.statut}</Text>
      <Text>Prestataire : {item.prestataire_nom}</Text>
      <Text>Téléphone : {item.prestataire_telephone}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={listeCommandes}
        keyExtractor={(item) => item.code_commande.toString()}
        renderItem={renderCommande}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            Aucune commande trouvée
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  }
});

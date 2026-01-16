import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useContext } from 'react'
import { GlobalContext } from '../config/GlobalUser';

export default function Connexion({navigation}) {

    const [telephone, setTelephone] = useState('');
    const [mdp, setMdp] = useState('');
    
    // variables de contexte global
    const {user, setUser} = useContext(GlobalContext);

    const Valider = async () => {
        if(!telephone || !mdp) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        try {
            const response = await fetch('https://epencia.net/app/souangah/domigo/connexion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telephone: telephone,
                    mdp: mdp,
                })   
            });
            
            const result = await response.json();
            
            // Vérifier si la réponse contient un message d'erreur
            if (result.message) {
                // C'est un message d'erreur
                alert(result.message);
            } else {
                // C'est un utilisateur valide (le tableau des résultats)
                if (result.length > 0 && result[0].telephone) {
                    setUser(result[0]);
                    if( result[0].role === 'prestataire' ) {     
                    navigation.navigate('BottomTab');
                    } else if( result[0].role === 'client' )
                         {
                        navigation.navigate('BottomClient');
                    }
                } else {
                    alert('Téléphone ou mot de passe incorrect');
                }
            }
            
        } catch (error) {
            alert('Erreur serveur ou problème de connexion');
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Espace Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Téléphone"
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={mdp}
                onChangeText={setMdp}
                secureTextEntry
            />    
            <TouchableOpacity style={styles.button} onPress={Valider}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '85%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#4A6FFF',
        paddingVertical: 12,
        paddingHorizontal: 64,
        borderRadius: 35,
        marginTop: 50,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState, useContext } from 'react';
import { GlobalContext } from '../config/GlobalUser';

export default function Connexion({ navigation }) {
    const [telephone, setTelephone] = useState('');
    const [mdp, setMdp] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { setUser } = useContext(GlobalContext);

    const Valider = async () => {
        if (!telephone.trim() || !mdp.trim()) {
            Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
            return;
        }
        
        setLoading(true);
        
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
            
            if (result.message) {
                Alert.alert('Erreur', result.message);
            } else {
                if (result.length > 0 && result[0].telephone) {
                    setUser(result[0]);
                    
                    if (result[0].role === 'prestataire') {
                        navigation.replace('BottomTab');
                    } else if (result[0].role === 'client') {
                        navigation.replace('BottomClient');
                    }
                } else {
                    Alert.alert('Erreur', 'Identifiants incorrects');
                }
            }
            
        } catch (error) {
            Alert.alert('Erreur', 'Problème de connexion');
            console.log('Erreur connexion:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Titre simple */}
            <View style={styles.header}>
                <Text style={styles.title}>DomiGo</Text>
                <Text style={styles.subtitle}>Connectez-vous</Text>
            </View>
            
            {/* Formulaire minimal */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    value={telephone}
                    onChangeText={setTelephone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#7A8C7A"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={mdp}
                    onChangeText={setMdp}
                    secureTextEntry
                    placeholderTextColor="#7A8C7A"
                />
                
                <TouchableOpacity style={styles.forgotLink}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={Valider}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? '...' : 'Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>
            
            {/* Lien vers inscription */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Pas de compte ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
                    <Text style={styles.footerLink}>S'inscrire</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FFF8', // Vert très clair
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
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
        borderColor: '#C8E6C9', // Vert pâle pour les bordures
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        color: '#2E7D32', // Texte en vert foncé
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotText: {
        fontSize: 14,
        color: '#4CAF50', // Vert moyen
        fontWeight: '500',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#2E7D32', // Vert foncé
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#81C784', // Vert clair pour état désactivé
        opacity: 0.8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 15,
        color: '#7A8C7A', // Vert grisâtre pour texte secondaire
    },
    footerLink: {
        fontSize: 15,
        fontWeight: '600',
        color: '#388E3C', // Vert légèrement plus foncé
    },
});
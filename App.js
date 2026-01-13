import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Router from './config/router';
import { GlobalProvider } from './config/GlobalUser';

export default function App() {
  return (
    <View style={{flex:1}}>
    
      <GlobalProvider>
        <Router />
      </GlobalProvider>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

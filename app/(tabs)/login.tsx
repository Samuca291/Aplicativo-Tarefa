import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = () => {
    // Validação simples do login
    if (email === 'admin@gmail.com' && password === 'admin123') {
      router.replace('/home');
    } else {
      Alert.alert(
        "Erro no Login",
        "Email ou senha inválidos",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <MaterialIcons name="assignment" size={80} color={isDark ? '#fff' : '#000'} />
        <ThemedText type="title" style={styles.appName}>Gerenciamento de Tarefas</ThemedText>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? '#8F8F8F' : '#666'}
            style={[styles.input, isDark && styles.inputDark]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor={isDark ? '#8F8F8F' : '#666'}
            style={[styles.input, isDark && styles.inputDark]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => {/* Implementar recuperação de senha */}}
        >
          <ThemedText style={styles.forgotPasswordText}>Esqueceu a senha?</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <ThemedText style={styles.loginButtonText}>Entrar</ThemedText>
        </TouchableOpacity>

        {/* Removido o registerContainer */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 30, // Adicionar padding inferior maior
    transform: [{ translateY: -10 }], // Move todos os componentes 10px para cima
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30, // Reduzido de 40 para 30
    gap: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainerDark: {
    backgroundColor: '#2C2C2C',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  inputDark: {
    color: '#FFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // Removido marginBottom já que é o último elemento
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

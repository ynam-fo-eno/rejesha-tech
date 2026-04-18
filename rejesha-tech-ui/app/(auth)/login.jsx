import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Logo from "../../assets/img/rejesha-tech-logo.png"; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link,router } from 'expo-router';
import { BASE_URL } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';
import themedAlert from "../../components/ThemedAlert";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { login } = useAuth();

const handleLogin = async () => {
  if (!form.username || !form.password) {
    themedAlert("Error", "Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // This handles the 404 "User not found" from your Aiven database
      themedAlert("Login Failed", data.message || "Invalid credentials");
      return;
    }

    // Success: Log the token and move to Welcome
    themedAlert("Success", "Logged in successfully!");
    await login(data.user, data.token);
    //console.log("JWT Token:", data.token); 
    router.replace('/profile'); 

  } catch (error) {
    console.error(error);
   themedAlert("Network Error", "Cannot connect to server. Ensure backend is live.");
  }
};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <SafeAreaProvider>
    <StatusBar translucent={true}></StatusBar>
    <SafeAreaView style = {{flex: 1, backgroundColor: '#899b9eff'}}>
      <View style={styles.container}>
        <View style = {styles.header}>
          <Text style = {styles.title}>WELCOME TO REJESHATECH!</Text>
          <Image source = {Logo} style = {styles.img}/>
          <Text style = {styles.subtitle}>Serving Technician and Client Anywhere in Kenya</Text>
          <Text style = {styles.title}>Login Page</Text>
        </View>

        <View style ={styles.form}>
          <View style = {styles.input}>
            <Text style = {styles.inputLabel}>username</Text>
            <TextInput
              style = {styles.inputControl}
              placeholder = "Enter username(case sensitive!)"
              placeholderTextColor= "#929292"
              value = {form.username}
              onChangeText={username => setForm({...form,username})}
            />
          </View>

          <Text style = {styles.inputLabel}>Password</Text>

          <View style = {styles.passwordInputContainer}>
            <TextInput
              style = {styles.passwordInput}
              placeholder = "Enter password"
              placeholderTextColor= "#929292"
              autoCapitalize="none"
              secureTextEntry={isPasswordVisible} // Bind the state here
              value = {form.password}
              onChangeText={password => setForm({...form,password})}
            />
            <Pressable onPress={togglePasswordVisibility} style={styles.visibilityBtn}>
              <MaterialCommunityIcons
                name={isPasswordVisible ? 'eye-off' : 'eye'} // Change icon based on state
                size={16}
                color="#232323"
              />
            </Pressable>
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                 <Text style={styles.btnText}>Sign In</Text> 
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => themedAlert("Coming Soon", "Password reset feature under construction!")}>
             <Text style={styles.formLink}>Forgot password?</Text>
           </TouchableOpacity>
          </View>
      </View>
       <TouchableOpacity>
         <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Link href="/register" style={styles.link}>Sign Up</Link>
          </Text>
          </TouchableOpacity>
          </View> 
    </SafeAreaView> 
    </SafeAreaProvider>
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,    
  },

  img : {
    height: 200,
    width : 200,
    marginBottom: 10,
    alignSelf: "center",
  },

  header: {
    marginVertical: 10,
  },

  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
    textAlign: "center",
  },

   subtitle: {
    marginTop: 10,
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
  },

  form:{

  },

  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },

  formLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#199908ff',
    textAlign: 'center',
    marginBottom:10,
  },

  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
    marginTop: 0,
  },

  

  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "italic",
    color: "#222",
    marginTop:5,
    marginBottom: 5,

  },

  input: {
  
  },

  inputControl: {
    height:44,
    backgroundColor:"#fff",
    paddingHorizontal: 20,
    borderRadius:12,
    outlineStyle: "none",
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
  },

   passwordInput: {
    flex: 1,
    height:44,
    paddingHorizontal: 20,
    fontSize: 15,
    outlineStyle: "none",

   },

   visibilityBtn: {
    paddingRight: 10,
  },



  card:{
    backgroundColor: "#3d4943ff",
    padding: 20,
    borderRadius:5,
    boxShadow: "4px 4px rgba(0,0,0,1)",
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop:20,
    marginBottom:20,
    paddingHorizontal: 20,
    height:30,
    borderWidth: 1,
    backgroundColor: '#ff0101ff',
    borderColor: '#000000ff',
    },
    
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#000000ff',
    },

 link: {
    fontSize: 20,
    fontWeight: "italic",
    marginVertical: 10,
    textDecorationLine: 'underline'
    
  },

});

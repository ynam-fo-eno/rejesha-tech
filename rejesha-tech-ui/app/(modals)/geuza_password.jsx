import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Logo from "../../assets/img/rejesha-tech-splash.png"; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link,router } from 'expo-router';
import { BASE_URL } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';
import themedAlert from "../../components/ThemedAlert";

const PasswordReset = () => {
  const [form, setForm] = useState({
    password: "",
    passwordConfirmed: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { passwordChange } = useAuth();

const handlePasswordChange = async () => {
  if (!form.passwordConfirmed || !form.password) {
    themedAlert("Incomplete.","Please fill in all fields",
         [
          { text: "OK", style: "/" },
        ]);
    return;
  }
   if (form.passwordConfirmed != form.password) {
    themedAlert("Incorrect", "Passwords need to match for a successful update.",
         [
          { text: "OK", style: "/" },
        ]);
    return;
  }
  else {
  themedAlert(
    "In progress", 
    "Sorry yet to work but will be coming soon!",
    [
      { 
        text: "BACK", 
        onPress: () => router.replace('/login') 
      }
    ]
  );
}

 
};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    
    <StatusBar translucent={true}></StatusBar>
    <SafeAreaView style = {{flex: 1, backgroundColor: "#80632a"}}>
      <View style={styles.container}>
        <View style = {styles.header}>
          <Text style = {styles.title}>WELCOME TO REJESHATECH!</Text>
          <Image source = {Logo} style = {styles.img}/>
          <Text style = {styles.subtitle}>Serving Technician and Client Anywhere in Kenya</Text>
          <Text style = {styles.title}>Password Reset Page- sorry....</Text>
        </View>

        <View style ={styles.form}>
          
          <Text style = {styles.inputLabel}>New Password</Text>
          <View style = {styles.passwordInputContainer}>
            <TextInput
              style = {styles.passwordInput}
              placeholder = "Enter new password"
              placeholderTextColor= "#929292"
              autoCapitalize="none"
              secureTextEntry={isPasswordVisible} 
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

          <Text style = {styles.inputLabel}>Confirm New Password</Text>
          <View style = {styles.passwordInputContainer}>
            <TextInput
              style = {styles.passwordInput}
              placeholder = "Make sure it matches!"
              placeholderTextColor= "#929292"
              autoCapitalize="none"
              secureTextEntry={isPasswordVisible} 
              value = {form.passwordConfirmed}
              onChangeText={passwordConfirmed => setForm({...form,passwordConfirmed})}
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
            <TouchableOpacity onPress={handlePasswordChange}>
              <View style={styles.btn}>
                 <Text style={styles.btnText}>Make New Password</Text> 
              </View>
            </TouchableOpacity>
          </View>
      </View>
       
        </View> 
    </SafeAreaView> 
    </ScrollView>
  );
}

export default PasswordReset;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
    alignItems: "center",
    width: "100%",
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
    width: '100%',
    maxWidth: 500,
    alignItems: "center",
    backgroundColor: "#D3CCBE",
  },

  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },

  formLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
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
    marginLeft: 10,
    textAlign: "center",

  },

  input: {
    marginLeft: 10,
    width: '80%',     

    
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
    marginLeft: 10,
    width: '80%',     


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
    height:50,
    borderWidth: 1,
    backgroundColor: '#95876b',
    borderColor: '#000000ff',
    width: '100%',     

    },
    
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#000000ff',
        flexDirection: "row",
        textAlign: "center",
    },

 link: {
    fontSize: 20,
    fontWeight: "italic",
    marginVertical: 10,
    textDecorationLine: 'underline'
    
  },

});

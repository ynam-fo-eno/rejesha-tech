import {Link,router} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TextInput, Pressable, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Logo from "../../assets/img/alt-rejesha-tech-logo.png"; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_URL } from "../../constants/config";
import themedAlert from '../../components/ThemedAlert';


const roleOptions = [
  { label: 'Client', value: 'Client' },    
  { label: 'Technician', value: 'Technician' },
  { label: 'Teacher', value: 'Teacher' },
];


const Register = () =>  {
const [form, setForm] = useState({
    fName: "",
    lName: "",
    username: "",
    email: "",
    password: "",
  });

  // NEW: State for real-time error messages
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // NEW: State for roles
  const [role1, setRole1] = useState(null);
  const [role2, setRole2] = useState(null);

  const validateName = (text, field) => {
    const nameRegex = /^[a-zA-Z\s]*$/; // Matches only letters and spaces
    if (!nameRegex.test(text)) {
      setErrors(prev => ({ ...prev, [field]: "Numbers/symbols not allowed" }));
    } else {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    setForm({ ...form, [field]: text });
  };

const handleRegister = async () => {
  // 1. Validation (Added lName and fName checks)
  if (!form.fName || !form.lName || !form.username || !form.email || !form.password || !role1) {
    themedAlert("Error", "Please fill all required fields (including Main Role)");
    return;
  }

  if (errors.fName || errors.lName) {
    themedAlert(
      "Validation Error", 
      "You cannot sign up with numbers or symbols in your name. Please correct the highlighted fields."
    );
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fName: form.fName,
        lName: form.lName,
        username: form.username,
        email: form.email,
        password: form.password,
        role1: role1,
        role2: role2, // This can be null, which is fine
      }),
    });

    const data = await response.json();

    // 2. The !response.ok check (The "Anti-Crash" logic)
    if (!response.ok) {
      themedAlert("Registration Failed", data.error || data.message || "An error occurred");
      return;
    }

    // 3. Success
    themedAlert("Success", "Account created! Please log in.");
    router.replace('/'); 

  } catch (error) {
    console.error(error);
    themedAlert("Network Error", "Cannot connect to server. Check your internet.");
  }
};


  return (
    <ScrollView>
    <SafeAreaProvider>
    <StatusBar translucent={true}></StatusBar>
    <SafeAreaView style = {{flex: 1, backgroundColor: '#929292'}}>
      <View style={styles.container}>
        <View style = {styles.header}>
          <Text style = {styles.title}>WELCOME TO REJESHATECH!</Text>
          <Image source = {Logo} style = {styles.img}/>
          <Text style = {styles.subtitle}>Serving Technician and Client Anywhere in Kenya</Text>
          <Text style = {styles.title}>Registration Page</Text>
        </View>

        <View style ={styles.form}>
          <View style = {styles.input}>
            <Text style = {styles.inputLabel}>First Name</Text>
            <TextInput
              style = {[styles.inputControl, errors.fName ? {borderColor: 'red', borderWidth: 1} : null]}
              placeholder = "Enter first name"
              placeholderTextColor= "#929292"
              value = {form.fName}
              onChangeText={text =>validateName(text, 'fName')}
            />
            {errors.fName ? <Text style={styles.errorText}>{errors.fName}</Text> : null}
          </View>

          <View style = {styles.input}>
            <Text style = {styles.inputLabel}>Last Name</Text>
            <TextInput
              style = {[styles.inputControl, errors.lName ? {borderColor: 'red', borderWidth: 1} : null]}
              placeholder = "Enter middle  name or suranme"
              placeholderTextColor= "#929292"
              value = {form.lName}
              onChangeText={text => validateName(text, 'lName')}
            />
            {errors.lName ? <Text style={styles.errorText}>{errors.lName}</Text> : null}
          </View>

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

           <View style = {styles.input}>
            <Text style = {styles.inputLabel}>Email</Text>
            <TextInput
              style = {styles.inputControl}
              placeholder = "Enter email "
              placeholderTextColor= "#929292"
              value = {form.email}
              onChangeText={email => setForm({...form,email})}
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

            {/* DROPDOWN 1 */}
      <View style={styles.dropDownContainer}>
        <Dropdown
          style={styles.dropdown} // Removed the isFocus conditional style
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={roleOptions} // Using the array from outside
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="I will mainly be a..."
          value={role1}
          onChange={item => setRole1(item.value)} // Simplified onChange
        />
      </View>

      {/* DROPDOWN 2 */}
      <View style={styles.dropDownContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={roleOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="...but I can also be a..."
          value={role2}
          onChange={item => setRole2(item.value)}
        />
      </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleRegister}>
                <View style={styles.btn}>
                   <Text style={styles.btnText}>Sign Up</Text> 
                </View>
            </TouchableOpacity>
        </View>
      </View>
       <TouchableOpacity>
          <Text style={styles.formFooter}>
            Have an account already?{' '}
                <Link href = "/login" style = {styles.link}>Sign In</Link>
            </Text>
          </TouchableOpacity>
          </View> 
    </SafeAreaView> 
    </SafeAreaProvider>
    </ScrollView>
  );
}

export default Register

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },

  img : {
    height: 100,
    width : 100,
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
    maxWidth: 400,
    alignItems: "stretch",

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
    width: '100%',        
    marginBottom: 12,
  },

  inputControl: {
    height:44,
    backgroundColor:"#fff",
    paddingHorizontal: 20,
    borderRadius:12,
    width: '100%',        
    borderWidth: 1,       
    borderColor: 'transparent',
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


  dropDownContainer: {
    padding: 16,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  errorText:{
     color: 'red', 
     fontSize: 12,
     marginTop: 4, 
  }

}); 
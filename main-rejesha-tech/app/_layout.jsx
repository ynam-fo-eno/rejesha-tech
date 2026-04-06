import { StyleSheet, Text, View } from 'react-native'
import {Slot, Stack} from 'expo-router'

const RootLayout = () => {

    return (
        <Stack screenOptions = {{
            headerStyle: {backgroundColor: "#ddd"},
            headerTintColor: "#333 ",
            textAlign : "center",
        }}>
            <Stack.Screen name = "index" options = {{title: "Login"}} />
            <Stack.Screen name = "register" options = {{title: "Registration Page"}} />
            <Stack.Screen name = "welcome" options = {{title: "Welcome Page"}} /> 
        </Stack>
    );
}

export default RootLayout;

const styles = StyleSheet.create({
    footerText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },

})

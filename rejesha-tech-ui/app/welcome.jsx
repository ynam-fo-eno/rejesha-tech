import { Text, StyleSheet, View } from 'react-native'
import {Link} from 'expo-router'


const Welcome = () =>  {
  
    return (
      <View style = {styles. container}>
        <Text style = {styles.title}> Welcome to RejeshaTech! </Text>
        <Link href = "/" style = {styles.link}>Back to home</Link>

      </View>
    );
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 0,
    fontSize: 40,
    fontWeight: "bold",
  },

  link: {
    backgroundColor : "#3d4943ff",
    fontSize: 20,
    fontWeight: "italic",
    marginVertical: 10,
    borderBottomwidth: 1,
  },
    
})

import {StyleSheet, Pressable,Text} from 'react-native';
import {Colors} from "../constants/Colors";


function ThemedButton({style, ...props}) {
    return (
        <Pressable 
            style = {({pressed}) => [styles.btn, (pressed && styles.pressed), style]}
            {...props}
        >
        
        </Pressable>
    );
}

const styles = StyleSheet.create({
        btn:{
            backgroundColor: Colors.primary,
            padding: 15,
            borderRadius: 6,
            marginVertical: 5,
        },

        pressed:{
            opacity: 0.6,
        },

    }
);

export default ThemedButton;

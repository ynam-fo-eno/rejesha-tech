import {Image, useColorScheme} from 'react-native';

//Images to import
import LightModeLogo from "../assets/alt-rejesha-tech-logo.png";
import DarkModeLogo from "../assets/rejesha-tech-logo.png";

const ThemedLogo =  ({...props}) => {
    const colorScheme = useColorScheme();

    const logo = colorScheme === "light"? LightModeLogo : DarkModeLogo

    return(
        <Image source = {logo} {...props}/>
    );

}

export default ThemedLogo;
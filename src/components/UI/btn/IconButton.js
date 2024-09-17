import { TouchableOpacity} from "react-native";
import {AntDesign} from "@expo/vector-icons";

export const IconButton = ({name, color, size, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <AntDesign name={name} size={size} color={color} />
        </TouchableOpacity>
    )
}
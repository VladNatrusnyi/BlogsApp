import {View, StyleSheet, Image} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import useThemeColors from "../../../hooks/useThemeColors";

export const BlogAvatarImg = ({size = 100, iconSize = 40, source = null}) => {

    const themeColors = useThemeColors();

    return (
        <View style={{width: size, height: size}}>
            {
                <View style={[styles.wrapper, {borderColor: themeColors.secondary}]}>
                    {
                        source
                            ? <Image
                                style={styles.image}
                                source={{uri: source}}
                                resizeMode='cover'
                            />
                            : <View>
                                <MaterialCommunityIcons name="clipboard-text-multiple-outline" size={iconSize} color={themeColors.secondary} />
                            </View>
                    }

                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
    },
})

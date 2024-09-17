import { Image, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import useThemeColors from "../hooks/useThemeColors";
import { AppButton } from "./UI/btn/AppButton";
import * as ImagePicker from "expo-image-picker";

export const ChooseBlogLogoImage = ({ payloadPhoto, changeBlogLogo }) => {

    const themeColors = useThemeColors();

    const uploadPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            changeBlogLogo(result.assets[0].uri);
        }
    };

    const clearPhoto = () => {
        changeBlogLogo('');
    };

    return (
      <View style={styles.wrapper}>
          <View style={[styles.container, { borderColor: themeColors.secondary }]}>
              {payloadPhoto
                ? <Image
                  style={styles.image}
                  resizeMode={'cover'}
                  source={{ uri: payloadPhoto }}
                />
                : <Feather name="image" size={44} color={themeColors.secondary} />}
          </View>

          <View style={styles.btnWrapper}>
              <AppButton
                buttonStyle={styles.addButton}
                text={'Add'}
                onPress={uploadPhoto}
              />

              <AppButton color={themeColors.primaryDark}
                         text={'Clear'}
                         onPress={clearPhoto}
              />
          </View>
      </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container: {
        width: 150,
        height: 150,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    btnWrapper: {},
    addButton: {
        marginBottom: 10,
    },
});

import {StyleSheet, Text, View} from "react-native";
import {AppInput} from "../UI/inputs/AppInput";
import useThemeColors from "../../hooks/useThemeColors";
import {ChooseBlogLogoImage} from "../ChooseBlogLogoImage";


export const CreateBlogForm = ({blogData, changeBlogData, formTitle}) => {

    const themeColors = useThemeColors();

    return (
        <View>
            <Text style={[styles.title, {color: themeColors.text}]}>{formTitle}</Text>

            <View style={[styles.fieldWrapper]}>
                <Text style={[styles.labelText, {color: themeColors.secondary}]}>Blog image</Text>
                <ChooseBlogLogoImage payloadPhoto={blogData.blogPhoto} changeBlogLogo={(data) => changeBlogData({blogPhoto: data})}/>
            </View>


            <View style={[styles.fieldWrapper]}>
                <Text style={[styles.labelText, {color: themeColors.secondary}]}>Blog name</Text>
                <AppInput
                    // isError={!!error}
                    onChangeValue={(text) => changeBlogData({name: text})}
                    value={blogData.name}
                    placeholderText={'Blog name'}
                    iconName={'file-text'}
                    inputStyle={{marginBottom: 15}}
                    multiline={true}
                />
            </View>

            <View style={[styles.fieldWrapper]}>
                <Text style={[styles.labelText, {color: themeColors.secondary}]}>Description</Text>
                <AppInput
                    // isError={!!error}
                    onChangeValue={(text) => changeBlogData({description: text})}
                    value={blogData.description}
                    placeholderText={'Description'}
                    iconName={'file-text'}
                    inputStyle={{marginBottom: 15}}
                    multiline={true}
                />
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    fieldWrapper: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.09)'
    },
    labelText: {
        fontSize: 20,
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    }
})

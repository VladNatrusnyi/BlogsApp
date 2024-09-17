import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useThemeColors from "../../hooks/useThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setOpenedBlogId } from "../../store/blogItemSlice";

export const BlogItem = ({ blogData }) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const themeColors = useThemeColors();

    return (
      <TouchableOpacity
        onPress={() => {
            dispatch(setOpenedBlogId(blogData.id))
            navigation.navigate('BlogNavigator')
        }}
        style={[
            styles.mainWrapper,
            {
                borderColor: themeColors.secondary,
                backgroundColor: themeColors.primaryDark,
            }
        ]}>
          <View style={styles.wrapper}>
              <View>
                  {
                      blogData.blogPhoto
                        ? <Image
                          source={{ uri: blogData.blogPhoto }}
                          style={styles.blogImage}
                          resizeMode={'contain'}
                        />
                        : <View style={[styles.nonImgWrapper, { borderColor: themeColors.secondary }]}>
                            <MaterialCommunityIcons name="clipboard-text-multiple-outline" size={40} color={themeColors.secondary} />
                        </View>
                  }
              </View>
              {
                blogData &&
                <View style={styles.textWrapper}>
                    <Text numberOfLines={1}
                          ellipsizeMode='tail'
                          style={[styles.name, { color: themeColors.text }]}>{blogData.name}</Text>
                    <Text style={[styles.subscribers, { color: themeColors.text }]}>{JSON.parse(blogData.subscribersNumber).length} subscribers</Text>
                </View>
              }
          </View>

          <View style={styles.notReadPosts}>
              <Text style={[styles.notReadText, { color: themeColors.text }]}></Text>
          </View>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        padding: 20,
        borderBottomWidth: 2,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapper: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        flex: 1
    },
    nonImgWrapper: {
        width: 70,
        height: 70,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blogImage: {
        width: 70,
        height: 70,
        alignSelf: 'center',
        borderRadius: 20
    },
    textWrapper: {
        flex: 1
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subscribers: {
        fontSize: 18,
    },
    notReadPosts: {
        width: 40,
        height: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notReadText: {
        fontSize: 16
    }
});

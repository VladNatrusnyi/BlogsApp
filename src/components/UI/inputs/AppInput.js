import React, {useState} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import useThemeColors from "../../../hooks/useThemeColors";
import {Feather} from "@expo/vector-icons";


export const AppInput = ({
                           value,
                           onChangeValue,
                           placeholderText,
                           isPassword = true,
                           isError = false,
                           iconName = '',
                           focus = () => {},
                           blur = () => {},
                           multiline = false,
                           inputStyle= {}}) => {

    const themeColors = useThemeColors();

    const [isFocused, setIsFocused] = useState(false);

    const onFocus = () => {
        setIsFocused(true);
        focus()
    };

    const onBlur = () => {
        setIsFocused(false);
        blur()
    };

    return (
        <View style={[
            styles.container,
            inputStyle,
            {
                backgroundColor: themeColors.primary,
                borderColor: isError ? 'red' : isFocused ? themeColors.secondary : themeColors.text,
            }
        ]}>
            <Feather name={iconName} size={24} color={isFocused ? themeColors.secondary : themeColors.text} />
            <TextInput
                multiline={multiline}
                placeholderTextColor={'gray'}
                style={[
                    styles.input,
                     {
                     color: isFocused ? themeColors.secondary : themeColors.text
                    },
                ]}
                placeholder={isFocused ? '' : placeholderText}
                value={value}
                autoCapitalize={'none'}
                onChangeText={onChangeValue}
                secureTextEntry={!isPassword}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        position: 'relative',
        paddingHorizontal: 10,
        width: '100%',
    },

    input: {
        flex: 1,
        fontSize: 20,
        marginVertical: 15,
        marginLeft: 10
    },
});

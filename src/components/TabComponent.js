import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useThemeColors from "../hooks/useThemeColors";

const TabComponent = ({activeTab, setActiveTab}) => {

    const themeColors = useThemeColors();

    return (
        <View style={[styles.container, {backgroundColor: themeColors.text}]}>
            <TouchableOpacity
                onPress={() => setActiveTab('Registration')}
                style={[
                    styles.tab,
                    activeTab === 'Registration' ? [styles.activeTab, {backgroundColor: themeColors.secondary,}] : styles.inactiveTab,
                ]}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 'Registration' ? [styles.activeText, {color: themeColors.primary}] : styles.inactiveText,
                    ]}
                >
                    Registration
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setActiveTab('Login')}
                style={[
                    styles.tab,
                    activeTab === 'Login' ? [styles.activeTab, {backgroundColor: themeColors.secondary,}] : styles.inactiveTab,
                ]}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 'Login' ? [styles.activeText, {color: themeColors.primary}] : styles.inactiveText,
                    ]}
                >
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        gap: 10
    },
    tab: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        flexGrow: 1,
    },
    activeTab: {
        borderRadius: 10,
    },
    inactiveTab: {
    },
    tabText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },
    activeText: {
    },
    inactiveText: {
        color: '#ccc',
    },
});

export default TabComponent;

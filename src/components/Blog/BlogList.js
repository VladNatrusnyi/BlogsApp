import React from 'react';
import { View, FlatList, Text } from 'react-native';
import {BlogItem} from "./BlogItem";
import useThemeColors from "../../hooks/useThemeColors";

const BlogList = ({ blogsArr }) => {

  const renderItem = ({ item }) => <BlogItem key={item.id} blogData={item} />;

  const themeColors = useThemeColors();

  return (
    <View>
      <FlatList
        data={blogsArr}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={{textAlign: 'center', color: themeColors.text}}>No blogs available.</Text>}
      />
    </View>
  );
};

export default BlogList;

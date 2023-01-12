import React, { createRef, useEffect, useRef, useState } from "react";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Animated, Easing, FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native";
import { MaterialTopTabDescriptorMap, MaterialTopTabNavigationEventMap } from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import { Theme } from "../../Scripts/Theme";

export default React.memo(function TabBar(props: MaterialTopTabBarProps) {
    const refFlatList = createRef<FlatList>();
    
    useEffect(()=>refFlatList.current?.scrollToIndex({ index: props.state.index, animated: true, viewPosition: 0, viewOffset: 8 }), [props.state]);

    function renderItem({ item, index }: ListRenderItemInfo<MaterialTopTabBarProps['state']['routes'][0]>) {
        return(<ItemTabBar
            key={`item-tabbar-${index}`}
            route={item}
            descriptors={props.descriptors}
            state={props.state}
            navigation={props.navigation}
            index={index}
        />);
    }
    function keyExtractor(_item: MaterialTopTabBarProps['state']['routes'][0], index: number) {
        return `item-tabbar-${index}`;
    }

    return(<View style={styles.tabBarContent}>
        <FlatList
            ref={refFlatList}
            data={props.state.routes}
            style={styles.tabBarScroll}
            contentContainerStyle={styles.tabBarScrollContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
        />
    </View>);
});

type IProps2 = {
    route: MaterialTopTabBarProps['state']['routes'][0];
    descriptors: MaterialTopTabDescriptorMap;
    state: TabNavigationState<ParamListBase>;
    navigation: NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>;
    index: number;
};
const ItemTabBar = React.memo(function (props: IProps2) {
    const { options } = props.descriptors[props.route.key];
    const label = (options.tabBarLabel !== undefined)? options.tabBarLabel: (options.title !== undefined)? options.title: props.route.name;
    const [isFocused, setIsFocused] = useState(false);
    // Animated
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;
    const duration = 300;
    const easing = Easing.linear;
    let actualState = false;

    function changeState(value: boolean) {
        if (actualState == value) return;
        actualState= value;
        let op = (value)? 1: 0;
        let sc = (value)? 1: 0.5;
        Animated.parallel([
            Animated.timing(opacity, { toValue: op, duration, easing, useNativeDriver: true }),
            Animated.timing(scale, { toValue: sc, duration, easing, useNativeDriver: true })
        ]).start();
    }

    function onPress() {
        const event = props.navigation.emit({
            type: 'tabPress',
            target: props.route.key,
            canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) props.navigation.navigate({ name: props.route.name, merge: true } as any);
    }
    function onLongPress() {
        props.navigation.emit({
          type: 'tabLongPress',
          target: props.route.key,
        });
    }

    useEffect(()=>{
        let isFocus = props.state.index === props.index;
        setIsFocused(isFocus);
        changeState(isFocus);
    }, [props.state]);

    return(<View style={styles.itemContain}>
        <TouchableRipple
            borderless={true}
            style={styles.item}
            onPress={onPress}
            onLongPress={onLongPress}>
            <>
                <Animated.View style={[styles.itemActive, { opacity, transform: [{ scale }] }]} />
                <Text style={styles.itemText}>{label as string}</Text>
            </>
        </TouchableRipple>
    </View>);
});

const styles = StyleSheet.create({
    tabBarContent: {
        width: '100%',
        height: 60,
        backgroundColor: Theme.colors.elevation.level2
    },
    tabBarScroll: {
        width: '100%',
        height: '100%'
    },
    tabBarScrollContent: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4
    },
    itemContain: {
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 6,
        paddingBottom: 6
    },
    itemActive: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        backgroundColor: Theme.colors.secondaryContainer
    },
    item: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden'
    },
    itemText: {
        marginLeft: 24,
        marginRight: 24,
        marginTop: 8,
        marginBottom: 8
    }
});
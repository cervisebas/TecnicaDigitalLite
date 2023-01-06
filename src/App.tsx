import React, { PureComponent, createRef } from "react";
import { Route, StatusBar, StyleSheet, View } from "react-native";
import { BottomNavigation, Provider as PaperProvider, Text } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from "./Scenes/Home";
import Account from "./Scenes/Account";
import { Theme } from "./Scripts/Theme";
import SystemNavigationBar from "react-native-system-navigation-bar";
import Session from "./Screens/Session";
import ScreenLoading, { ScreenLoadingRef } from "./Screens/ScreenLoading";

type IProps = {};
type IState = {
    index: number;
};

export default class App extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            index: 0
        };
        this._onIndexChange = this._onIndexChange.bind(this);
        this._renderScene = this._renderScene.bind(this);
    }
    private routes = [
        { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'details', title: 'Mi cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ];
    private refSession = createRef<Session>();
    private refScreenLoading = createRef<ScreenLoadingRef>();

    componentDidMount(): void {
        SplashScreen.hide();
        SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');
    }
    
    _onIndexChange(index: number) {
        this.setState({ index });
    }
    _renderScene(props: { route: Route; jumpTo: (key: string) => void; }) {
        switch (props.route.key) {
            case 'home':
                return <Home />;
            case 'details':
                return <Account />;
        }
    }
    _renderLabel(props: { route: Route; focused: boolean; color: string; }) {
        return(<Text
            style={styles.labelNavigation}
            variant={'labelMedium'}
        >
            {props.route.title}
        </Text>);
    }

    render(): React.ReactNode {
        return(<View style={styles.content}>
            <PaperProvider theme={Theme}>
                <BottomNavigation
                    navigationState={{
                        index: this.state.index,
                        routes: this.routes
                    }}
                    sceneAnimationEnabled={true}
                    sceneAnimationType={'shifting'}
                    onIndexChange={this._onIndexChange}
                    renderScene={this._renderScene}
                    renderLabel={this._renderLabel}
                />
                <Session ref={this.refSession} />
                <ScreenLoading ref={this.refScreenLoading} />
            </PaperProvider>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    labelNavigation: {
        fontSize: 12,
        height: 56,
        textAlign: 'center',
        backgroundColor: 'transparent'
    }
});
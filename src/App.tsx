import React, { PureComponent, createRef } from "react";
import { Route, StyleSheet, View } from "react-native";
import { BottomNavigation, Provider as PaperProvider, Text } from "react-native-paper";
import Home from "./Scenes/Home";
import Account from "./Scenes/Account";
import { Theme } from "./Scripts/Theme";
import Session from "./Screens/Session";
import ScreenLoading, { ScreenLoadingRef } from "./Screens/ScreenLoading";
import SplashScreen from "./Screens/SplashScreen";
import { Family, urlBase } from "./Scripts/ApiTecnica";
import { StudentsData } from "./Scripts/ApiTecnica/types";
import { waitTo } from "./Scripts/Utils";
import { decode } from "base-64";
import ChangeCardDesign from "./Screens/ChangeCardDesign";

type IProps = {};
type IState = {
    index: number;
    datas: StudentsData;
};

export default class App extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            index: 0,
            datas: this.defaultDatas
        };
        this._onIndexChange = this._onIndexChange.bind(this);
        this._renderScene = this._renderScene.bind(this);
        this.init = this.init.bind(this);
        this._openChangeCardDesign = this._openChangeCardDesign.bind(this);
    }
    private routes = [
        { key: 'home', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'details', title: 'Mi cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ];
    private defaultDatas = { id: '-', name: '-', dni: '-', curse: '-', tel: '-', email: '-', date: '-', picture: '-' };
    private refSession = createRef<Session>();
    private refScreenLoading = createRef<ScreenLoadingRef>();
    private refChangeCardDesign = createRef<ChangeCardDesign>();

    componentDidMount(): void {
        /*RNSplashScreen.hide();
        SystemNavigationBar.setNavigationColor(Theme.colors.elevation.level2, 'dark');
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');*/
    }
    async init() {
        this.setState({ datas: this.defaultDatas });
        this.refScreenLoading.current?.open();
        this.refScreenLoading.current?.setText(true, 'Iniciando sesión...');
        try {
            await Family.verify();
            this.refScreenLoading.current?.setText(true, 'Obteniendo datos locales...');
            const getLocalData = await Family.getDataLocal();
            this.refScreenLoading.current?.setInformation(decode(getLocalData.name), `${urlBase}/image/${decode(getLocalData.picture)}`);
            this.refScreenLoading.current?.setEndHere(true);
            this.refScreenLoading.current?.startAnimation();
            await waitTo(1024);
            this.refScreenLoading.current?.setText(true, 'Obteniendo información...');
            const studentData = await Family.getDataStudent();
            this.setState({ datas: studentData });
            await waitTo(1000);
            this.refScreenLoading.current?.close();
        } catch (error: any) {
            if (error.relogin) {
                await waitTo(1024);
                this.refScreenLoading.current?.close();
                return this.refSession.current?.open();
            }
            this.refScreenLoading.current?.setShowLoading(false);
            this.refScreenLoading.current?.setText(true, error.cause);
        }
    }
    _openChangeCardDesign() {
        this.refChangeCardDesign.current?.open();
    }
    
    // Navigation
    _onIndexChange(index: number) {
        this.setState({ index });
    }
    _renderScene(props: { route: Route; jumpTo: (key: string) => void; }) {
        switch (props.route.key) {
            case 'home':
                return <Home datas={this.state.datas} openChangeDesign={this._openChangeCardDesign} />;
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
                <Session ref={this.refSession} initNow={this.init} />
                <ScreenLoading ref={this.refScreenLoading} />
                <SplashScreen initNow={this.init} />
                <ChangeCardDesign ref={this.refChangeCardDesign} />
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
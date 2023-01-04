import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import ViewShot from "react-native-view-shot";

type IProps = {
    openSession: ()=>any;
};
type IState = {};

export default class Home extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={styles.content}>
            <Appbar.Header>
                <Appbar.Content title={'TecnicaDigital'} />
            </Appbar.Header>
            <View style={styles.content}>
                <ViewShot style={{ width: 200, height: 200, backgroundColor: 'red' }}>
                    
                </ViewShot>
                <Button children={'Open Session'} onPress={this.props.openSession} />
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    }
});
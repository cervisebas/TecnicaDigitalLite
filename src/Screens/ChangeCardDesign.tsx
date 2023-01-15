import React, { PureComponent } from "react";
import CustomModal from "../Components/CustomModal";
import { Dimensions, EmitterSubscription, FlatList, Image, ListRenderItemInfo, Platform, ScaledSize, StyleSheet, View } from "react-native";
import { Theme } from "../Scripts/Theme";
import { Appbar, TouchableRipple } from "react-native-paper";
import ExampleCards from "../Scripts/ExampleCards";
import { getForScale } from "../Scripts/Utils";

type IProps = {
    changeDesign: (id: number)=>void;
};
type IState = {
    visible: boolean;
    scale: number;
};

export default class ChangeCardDesign extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            scale: 0
        };
        this.close = this.close.bind(this);
        this.changeScale = this.changeScale.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._getItemLayout = this._getItemLayout.bind(this);
    }
    private event: EmitterSubscription | undefined = undefined;

    componentDidMount(): void {
        this.event = Dimensions.addEventListener('change', this.changeScale);
        let window = Dimensions.get('window');
        this.changeScale({ window });
    }
    componentWillUnmount(): void {
        this.event?.remove();
    }
    changeScale({ window }: { window: ScaledSize; }) {
        let width = window.width;
        if (width > 600) width = 600;
        const scale = ((width - 16)/1200);
        this.setState({ scale });
    }
    // ##### FlatList #####
    _renderItem({ item }: ListRenderItemInfo<{ id: number; image: any; }>) {
        return(<ItemImage
            key={`card-design-${item.id}`}
            id={item.id}
            image={item.image}
            scale={this.state.scale}
            close={this.close}
            onPress={this.props.changeDesign}
        />);
    }
    _keyExtractor(item: { id: number; image: any; }, _index: number) {
        return `card-design-${item.id}`;
    }
    _getItemLayout(_data: { id: number; image: any; }[] | null | undefined, index: number) {
        const ITEM_HEIGHT = getForScale(this.state.scale, 779) + 8;
        return {
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index
        };
    }
    // ####################

    open() {
        this.setState({ visible: true });
    }
    close() {
        this.setState({ visible: false });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close} animationIn={'fadeInRight'} animationInTiming={200} animationOut={'fadeOutLeft'} animationOutTiming={200} backdropTransitionInTiming={0} backdropTransitionOutTiming={0} useBackdrop={false}>
            <View style={styles.content}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={'Lista de diseños'} />
                </Appbar.Header>
                <View style={styles.subContent}>
                    <FlatList
                        key={`list-desings-layout-${this.state.scale}`}
                        style={styles.flatlist}
                        contentContainerStyle={styles.flatlistContent}
                        data={ExampleCards}
                        keyExtractor={this._keyExtractor}
                        getItemLayout={this._getItemLayout}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        </CustomModal>);
    }
}

type IProps2 = {
    id: number;
    image: any;
    scale: number;
    close: ()=>void;
    onPress?: (id: number)=>void;
};
const ItemImage = React.memo(function (props: IProps2) {
    function onPress() {
        if (props.onPress) {
            props.onPress(props.id);
            props.close();
        }
    }
    return(<TouchableRipple borderless={Platform.Version > 25} style={[styles.itemTouch, { width: getForScale(props.scale, 1200), height: getForScale(props.scale, 779) }]} onPress={onPress}>
        <Image
            source={props.image}
            style={styles.itemImage}
            resizeMethod={'auto'}
            resizeMode={'cover'}
        />
    </TouchableRipple>);
});

const styles = StyleSheet.create({
    content: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.colors.background
    },
    subContent: {
        flex: 1,
        alignItems: 'center'
    },
    itemTouch: {
        overflow: 'hidden',
        borderRadius: 12,
        borderColor: '#000000',
        borderWidth: 2,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        marginBottom: 4
    },
    itemImage: {
        width: '100%',
        height: '100%'
    },
    flatlist: {
        width: '100%'
    },
    flatlistContent: {
        alignItems: 'center'
    }
});
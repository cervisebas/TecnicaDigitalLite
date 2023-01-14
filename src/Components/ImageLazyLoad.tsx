import React, { PureComponent } from "react";
import { Image, ImageResizeMode, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import RNFS from "react-native-fs";
// Images
import ProfilePicture from "../Assets/profile.webp";
import { Theme } from "../Scripts/Theme";
import { ActivityIndicator } from "react-native-paper";

type IProps = {
    source: {
        uri: string;
    };
    style?: StyleProp<ViewStyle>;
    circle?: boolean;
    size?: number;
    resizeMode?: ImageResizeMode | undefined; 
    loadSize?: number | "small" | "large";
    onLoad?: ()=>any;
};
type IState = {
    isLoading: boolean;
    source: ImageSourcePropType | undefined;
};

const CacheDir = RNFS.CachesDirectoryPath;

export default class ImageLazyLoad extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            source: undefined
        };
        this.updateImage = this.updateImage.bind(this);
    }
    private _isMount: boolean = false;
    componentDidMount() {
        this._isMount = true;
        this.updateImage();
    }
    componentWillUnmount(): void {
        this._isMount = false;
    }
    componentDidUpdate(prevProps: Readonly<IProps>): void {
        if (prevProps.source.uri !== this.props.source.uri) this.forceNowUpdate();
    }
    forceNowUpdate() {
        this.setState({
            isLoading: true,
            source: undefined
        }, this.updateImage);
    }
    updateImage() {
        const fileName = this.props.source.uri.split('/').pop();
        RNFS.exists(`${CacheDir}/${fileName}`).then((val)=>{
            if (val) return (this._isMount)&&this.setState({ source: { uri: `file://${CacheDir}/${fileName}` }, isLoading: false });
            RNFS.downloadFile({ fromUrl: this.props.source.uri, toFile: `${CacheDir}/${fileName}` }).promise
                .then(()=>(this._isMount)&&this.setState({ source: { uri: `file://${CacheDir}/${fileName}` }, isLoading: false }))
                .catch(()=>(this._isMount)&&this.setState({ source: ProfilePicture, isLoading: false }));
        }).catch(()=>(this._isMount)&&this.setState({ source: ProfilePicture, isLoading: false }));
    }
    render(): React.ReactNode {
        return(<View style={[styles.view, { width: this.props.size, height: this.props.size }, this.props.style, (this.props.circle)? styles.circle: undefined, (this.props.circle)? { shadowColor: '#000000' }: undefined]}>
            {(this.state.isLoading)? <View style={styles.loading}>
                <ActivityIndicator
                    animating={true}
                    size={(this.props.loadSize)? this.props.loadSize: 'large'}
                />
            </View>:
            <Image
                source={this.state.source}
                style={{ width: '100%', height: '100%' }}
                resizeMode={this.props.resizeMode}
                onLoad={this.props.onLoad}
                onError={this.props.onLoad}
            />}
        </View>);
    }
}

const styles = StyleSheet.create({
    view: {
        position: 'relative',
        overflow: 'hidden'
    },
    circle: {
        //shadowColor: "#000000",
        shadowOffset:{
            width: 0,
            height: 1
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 1024,
        overflow: 'hidden'
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.colors.elevation.level3,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
import React, { useState } from "react";
import { Image, NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData } from "react-native";
import { DesingsCardsType } from "../Scripts/DesingsCardsType";
import { urlBase } from "../Scripts/ApiTecnica";
import { getForScale, safeDecode } from "../Scripts/Utils";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import ImageLazyLoad from "./ImageLazyLoad";

type IProps = {
    scale: number;
    dni: string;
    name: string;
    image: string;
    designEstructure: DesingsCardsType;
};

export default React.memo(function CardEstructure(props: IProps) {
    const [numberLines, setNumberLines] = useState(0);
    function onTextLayout(event: NativeSyntheticEvent<TextLayoutEventData>) {
        let lines = event.nativeEvent.lines.length;
        setNumberLines(lines - 1);
    }
    function getTopMoreLines(): number {
        let top = props.designEstructure.name.y;
        let fontSize = props.designEstructure.name.fontSize;
        let calcPer = Math.fround((40 * fontSize)/100);
        return Math.fround(top - (calcPer * numberLines));
    }
    return(<>
        <Image
            source={props.designEstructure.background}
            style={style.background}
            resizeMethod={'auto'}
            resizeMode={'cover'}
        />
        {(props.designEstructure.image)&&<ImageLazyLoad
            source={{ uri: `${urlBase}/image/${safeDecode(props.image)}` }}
            resizeMode={'cover'}
            loadSize={'small'}
            style={{
                position: 'absolute',
                top: getForScale(props.scale, props.designEstructure.image.y),
                left: getForScale(props.scale, props.designEstructure.image.x),
                width: getForScale(props.scale, props.designEstructure.image.width),
                height: getForScale(props.scale, props.designEstructure.image.height),
                borderWidth: (props.designEstructure.image.borderWidth)? getForScale(props.scale, props.designEstructure.image.borderWidth): undefined,
                borderColor: props.designEstructure.image.borderColor,
                borderRadius: getForScale(props.scale, props.designEstructure.image.borderRadius)
            }}
        />}
        <Text
            allowFontScaling={false}
            style={{
                position: 'absolute',
                top: (props.designEstructure.name.maxNumberLines as number > 1)? getForScale(props.scale, getTopMoreLines()): getForScale(props.scale, props.designEstructure.name.y),
                left: getForScale(props.scale, props.designEstructure.name.x),
                width: getForScale(props.scale, props.designEstructure.name.width),
                height: (props.designEstructure.name.height)? getForScale(props.scale, props.designEstructure.name.height): undefined,
                color: props.designEstructure.name.color,
                fontSize: getForScale(props.scale, props.designEstructure.name.fontSize),
                fontFamily: props.designEstructure.name.fontFamily,
                fontWeight: props.designEstructure.name.fontWeight,
                textAlign: props.designEstructure.name.textAlign,
                textShadowColor: props.designEstructure.name.textShadowColor,
                textShadowOffset: (props.designEstructure.name.textShadowOffset !== undefined)? {
                    width: getForScale(props.scale, props.designEstructure.name.textShadowOffset.width),
                    height: getForScale(props.scale, props.designEstructure.name.textShadowOffset.height)
                }: undefined,
                textShadowRadius: (props.designEstructure.name.textShadowRadius)? getForScale(props.scale, props.designEstructure.name.textShadowRadius): undefined
            }}
            numberOfLines={props.designEstructure.name.maxNumberLines}
            onTextLayout={onTextLayout}
        >{safeDecode(props.name)}</Text>
        <Barcode
            value={`eest${safeDecode(props.dni)}`}
            width={getForScale(props.scale, props.designEstructure.barcode.width)}
            maxWidth={getForScale(props.scale, props.designEstructure.barcode.width)}
            height={getForScale(props.scale, props.designEstructure.barcode.height)}
            style={{
                position: 'absolute',
                top: getForScale(props.scale, props.designEstructure.barcode.y),
                left: getForScale(props.scale, props.designEstructure.barcode.x)
            }}
        />
    </>);
});

const style = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%'
    }
});
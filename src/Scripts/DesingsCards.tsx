import { DesingsCardsType } from "./DesingsCardsType";
// Backgrounds
import Card0 from "../Assets/Desings/default.webp";


const DesingsCards: DesingsCardsType[] = [{
    id: 0,
    background: Card0,
    barcode: {
        width: 1000,
        height: 247,
        x: 100,
        y: 480
    },
    image: {
        width: 300,
        height: 300,
        x: 60,
        y: 80,
        borderRadius: 10,
        borderWidth: 10,
        borderColor: '#0038FF'
    },
    name: {
        width: 780,
        y: 192,
        x: 420,
        color: '#000000',
        fontSize: 64,
        maxNumberLines: 2
    }
}];

export default DesingsCards;
import { decode } from "base-64";
import { Matter, Schedule } from "../../Scripts/ApiTecnica/types";
import { PermissionsAndroid, ToastAndroid } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { safeDecode } from "../../Scripts/Utils";

export default async function CreatePDF(curse: string, datas: Schedule[]): Promise<string> {
    try {
        const morning: Schedule[] = [];
        const afternoon: Schedule[] = [];
        
        const time1 = ['7:15', '8:40', '9:50', '11:00'];
        const time2 = ['13:15', '14:25', '15:35', '16:45'];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        datas.forEach((data)=>{
            if (time1.find((v)=>v == data.hour) !== undefined)
                morning.push(data);
            else if (time2.find((v)=>v == data.hour) !== undefined)
                afternoon.push(data);
        });

        const _rows1_2: string[][] = [];
        const useIndex1: number[] = [];
        morning.forEach((data, index)=>{
            if (useIndex1.findIndex((v)=>v == index) !== -1) return;

            const timeIndex = time1.findIndex((v)=>v == data.hour);
            const dayIndex = days.findIndex((v)=>v == data.day);

            var group2 = morning.findIndex((data2, index2)=>data.hour == data2.hour && index !== index2 && data2.group !== 'none' && data.day == data2.day);
            var isGroup = group2 !== -1;
            var isOnlyGroup = !isGroup && data.group != 'none';

            var normalText: string = '';
            if (isGroup) {
                normalText = `Grupo ${data.group}: ${(data.matter == 'none')? '': (data.matter.name == null)? '<span class="null-group">Desconocido</span>': decode(data.matter.name)}`;
                normalText += `<br>Grupo ${morning[group2].group}: ${(morning[group2].matter == 'none')? '': ((morning[group2].matter as Matter).name == null)? '<span class="null-group">Desconocido</span>': decode((morning[group2].matter as Matter).name)}`;
                useIndex1.push(group2);
            } else if(isOnlyGroup) {
                normalText = `Grupo ${data.group}: ${(data.matter == 'none')? '': (data.matter.name == null)? '<p class="null">Desconocido</p>': decode(data.matter.name)}`;
            } else {
                normalText = `${(data.matter == 'none')? '': (data.matter.name == null)? '<p class="null">Desconocido</p>': decode(data.matter.name)}`;
            }

            if (_rows1_2[dayIndex] == undefined) {
                const newArray2: string[] = [];
                newArray2[timeIndex] = normalText;
                _rows1_2[dayIndex] = newArray2;
                return;
            }
            _rows1_2[dayIndex][timeIndex] = normalText;
        });
        const _rows1: string[][] = [];
        for (let i = 0; i < 4; i++) {
            _rows1[i] = [
                _rows1_2[0][i],
                _rows1_2[1][i],
                _rows1_2[2][i],
                _rows1_2[3][i],
                _rows1_2[4][i]
            ];
        }

        const _rows2_2: string[][] = [];
        const useIndex2: number[] = [];
        afternoon.forEach((data, index)=>{
            if (useIndex2.findIndex((v)=>v == index) !== -1) return;

            const timeIndex = time2.findIndex((v)=>v == data.hour);
            const dayIndex = days.findIndex((v)=>v == data.day);

            var group2 = afternoon.findIndex((data2, index2)=>data.hour == data2.hour && index !== index2 && data2.group !== 'none' && data.day == data2.day);
            var isGroup = group2 !== -1;
            var isOnlyGroup = !isGroup && data.group != 'none';

            var normalText: string = '';
            if (isGroup) {
                normalText = `Grupo ${data.group}: ${(data.matter == 'none')? '': (data.matter.name == null)? '<span class="null-group">Desconocido</span>': decode(data.matter.name)}`;
                normalText += `<br>Grupo ${afternoon[group2].group}: ${(afternoon[group2].matter == 'none')? '': ((afternoon[group2].matter as Matter).name == null)? '<span class="null-group">Desconocido</span>': decode((afternoon[group2].matter as Matter).name)}`;
                useIndex2.push(group2);
            } else if(isOnlyGroup) {
                normalText = `Grupo ${data.group}: ${(data.matter == 'none')? '': (data.matter.name == null)? '<p class="null">Desconocido</p>': decode(data.matter.name)}`;
            } else {
                normalText = `${(data.matter == 'none')? '': (data.matter.name == null)? '<p class="null">Desconocido</p>': decode(data.matter.name)}`;
            }

            if (_rows2_2[dayIndex] == undefined) {
                const newArray2: string[] = [];
                newArray2[timeIndex] = normalText;
                _rows2_2[dayIndex] = newArray2;
                return;
            }
            _rows2_2[dayIndex][timeIndex] = normalText;
        });
        const _rows2: string[][] = [];
        for (let i = 0; i < 4; i++) {
            _rows2[i] = [
                _rows2_2[0][i],
                _rows2_2[1][i],
                _rows2_2[2][i],
                _rows2_2[3][i],
                _rows2_2[4][i]
            ];
        }
        try {
            const uriDocument = await createDocument(safeDecode(curse), _rows1, _rows2);
            try {
                const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: "Atención",
                    message: "Para guardar el archivo se necesita acceder al almacenamiento de su dispositivo, por favor acepte los permisos que se requieren.",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                });
                if (permission == PermissionsAndroid.RESULTS.DENIED) {
                    ToastAndroid.show('Se denegó el acceso al almacenamiento del dispositivo', ToastAndroid.SHORT);
                    return uriDocument;
                }
                const newUri = `${RNFS.DownloadDirectoryPath}/horarios-${safeDecode(curse).replace('°', '-')}.pdf`;
                await RNFS.copyFile(uriDocument, newUri);
                ToastAndroid.show('El archivo se copio correctamente en la carpeta de descargas', ToastAndroid.SHORT);
                return newUri;
            } catch (error) {
                console.log(error);
                ToastAndroid.show('Ocurrió un error al copiar el archivo a la carpeta de descargas', ToastAndroid.SHORT);
                return uriDocument;
            }
        } catch (error) {
            console.log(error);
            throw "Ocurrió un error durante la conversión del archivo.";
        }
    } catch (error) {
        console.log(error);
        throw "Ocurrió un error durante el proceso de los datos.";
    }
}


function getHTML(curse: string, rows1: string[][], rows2: string[][]) {
    return(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Horario ${curse}</title>
        <style>
            * {
                font-family: Arial, Helvetica, sans-serif;
            }
            div.pages {
                /*position: absolute;
                top: 0;
                left: 0;
                width: 595px;
                height: 842px;*/
                position: relative;
                width: 100%;
                height: 100%;
                overflow: visible;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            table, th, td {
                border: 2px solid black;
                border-collapse: collapse;
            }
            table {
                width: calc(100% - 64px);
            }
            table p {
                margin: 0;
            }
            table p.center {
                width: 100%;
                height: 100%;
                text-align: center;
            }
            table p.matter {
                width: 100%;
                height: 100%;
                text-align: center;
            }
            table h2 {
                margin: 0;
                width: 100%;
                text-align: center;
                font-weight: 600;
                font-size: 24px;
            }
            table tr td {
                padding-top: 8px;
                padding-bottom: 8px;
                padding-left: 6px;
                padding-right: 6px;
            }
            table tr.title {
                background-color: #6EA9F9;
            }
            table tr.title h2 {
                font-size: 18px;
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            table tr.days {
                overflow: hidden;
                background-color: #9FC6F9;
            }
            table tr.days p {
                font-size: 16px;
                font-weight: 600;
            }
            table td.time {
                background-color: #CEE3fC;
            }
            table td.time p {
                font-size: 16px;
                font-weight: 600;
            }
            table td p {
                font-size: 12px;
            }
            table td p.null {
                width: 100%;
                height: 100%;
                text-align: center;
                color: #FF0000;
            }
            table td span.null-group {
                margin: 0;
                padding: 0;
                color: #FF0000;
            }
            h4#brand {
                margin-top: 18px;
                opacity: 0.6;
                font-size: 18px;
                color: #000000;
            }
        </style>
    </head>
    <body>
        <div class="pages">
            <table>
                <!-- Turno mañana -->
                <tr class="title"><td colspan="6"><h2>Turno Mañana</h2></td></tr>
                <tr class="days">
                    <td></td>
                    <td><p class="center">Lunes</p></td>
                    <td><p class="center">Martes</p></td>
                    <td><p class="center">Miercoles</p></td>
                    <td><p class="center">Jueves</p></td>
                    <td><p class="center">Viernes</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">7:30<br>A<br>8:30</p></td>
                    <td><p class="matter">${rows1[0][0]}</p></td>
                    <td><p class="matter">${rows1[0][1]}</p></td>
                    <td><p class="matter">${rows1[0][2]}</p></td>
                    <td><p class="matter">${rows1[0][3]}</p></td>
                    <td><p class="matter">${rows1[0][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">8:40<br>A<br>9:40</p></td>
                    <td><p class="matter">${rows1[1][0]}</p></td>
                    <td><p class="matter">${rows1[1][1]}</p></td>
                    <td><p class="matter">${rows1[1][2]}</p></td>
                    <td><p class="matter">${rows1[1][3]}</p></td>
                    <td><p class="matter">${rows1[1][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">9:50<br>A<br>10:50</p></td>
                    <td><p class="matter">${rows1[2][0]}</p></td>
                    <td><p class="matter">${rows1[2][1]}</p></td>
                    <td><p class="matter">${rows1[2][2]}</p></td>
                    <td><p class="matter">${rows1[2][3]}</p></td>
                    <td><p class="matter">${rows1[2][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">11:00<br>A<br>12:00</p></td>
                    <td><p class="matter">${rows1[3][0]}</p></td>
                    <td><p class="matter">${rows1[3][1]}</p></td>
                    <td><p class="matter">${rows1[3][2]}</p></td>
                    <td><p class="matter">${rows1[3][3]}</p></td>
                    <td><p class="matter">${rows1[3][4]}</p></td>
                </tr>
                
                <!-- Turno tarde -->
                <tr class="title"><td colspan="6"><h2>Turno Tarde</h2></td></tr>
                <tr class="days">
                    <td></td>
                    <td><p class="center">Lunes</p></td>
                    <td><p class="center">Martes</p></td>
                    <td><p class="center">Miercoles</p></td>
                    <td><p class="center">Jueves</p></td>
                    <td><p class="center">Viernes</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">13:15<br>A<br>14:15</p></td>
                    <td><p class="matter">${rows2[0][0]}</p></td>
                    <td><p class="matter">${rows2[0][1]}</p></td>
                    <td><p class="matter">${rows2[0][2]}</p></td>
                    <td><p class="matter">${rows2[0][3]}</p></td>
                    <td><p class="matter">${rows2[0][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">14:25<br>A<br>15:25</p></td>
                    <td><p class="matter">${rows2[1][0]}</p></td>
                    <td><p class="matter">${rows2[1][1]}</p></td>
                    <td><p class="matter">${rows2[1][2]}</p></td>
                    <td><p class="matter">${rows2[1][3]}</p></td>
                    <td><p class="matter">${rows2[1][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">15:35<br>A<br>16:35</p></td>
                    <td><p class="matter">${rows2[2][0]}</p></td>
                    <td><p class="matter">${rows2[2][1]}</p></td>
                    <td><p class="matter">${rows2[2][2]}</p></td>
                    <td><p class="matter">${rows2[2][3]}</p></td>
                    <td><p class="matter">${rows2[2][4]}</p></td>
                </tr>
                <tr>
                    <td class="time"><p class="center">16:45<br>A<br>17:45</p></td>
                    <td><p class="matter">${rows2[3][0]}</p></td>
                    <td><p class="matter">${rows2[3][1]}</p></td>
                    <td><p class="matter">${rows2[3][2]}</p></td>
                    <td><p class="matter">${rows2[3][3]}</p></td>
                    <td><p class="matter">${rows2[3][4]}</p></td>
                </tr>
            </table>
            <h4 id="brand">SCApps Productions</h4>
        </div>
    </body>
    </html>`);
}

function createDocument(curse: string, rows1: string[][], rows2: string[][]): Promise<string> {
    return new Promise((resolve, reject)=>{
        try {
            var nameFile = `Horario ${curse.replace('°', '-')}`;
            var htmlFinal = getHTML(curse, rows1, rows2).replace(/\n/gi, '');
            var options: RNHTMLtoPDF.Options = {
                html: htmlFinal,
                fileName: nameFile,
                width: 595,
                directory: 'Documents'
            };
            RNHTMLtoPDF.convert(options)
                .then((value)=>(value.filePath)? resolve(value.filePath): reject('Ocurrió un error al generar el archivo.'))
                .catch(()=>reject('Ocurrió un error al generar el archivo.'));
        } catch {
            return reject('Ocurrió un error inesperado.');
        }
    });
}
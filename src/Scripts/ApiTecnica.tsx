import FamilySystem from "./ApiTecnica/family";
import { SecurityHeaderFamily } from "./SecurityKeyCodes";

const urlBase: string = 'https://tecnicadigital.com.ar';
//const urlBase: string = 'http://192.168.1.37/TecnicaDigitalApi';

const Family = new FamilySystem(urlBase, SecurityHeaderFamily);

export { Family, urlBase };
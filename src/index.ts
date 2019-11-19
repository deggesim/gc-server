import { Container } from 'typescript-ioc';
import GestioneCasa from './gestione-casa';

const app: GestioneCasa = Container.get(GestioneCasa);
app.start();

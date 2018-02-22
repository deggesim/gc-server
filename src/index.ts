import 'reflect-metadata';

import { Container } from 'typescript-ioc';

import GestioneCasa from './GestioneCasa';

const app: GestioneCasa = Container.get(GestioneCasa);
app.start();

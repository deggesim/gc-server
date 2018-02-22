import { Singleton } from 'typescript-ioc';

import BadRequestEntity from '../exceptions/BadRequestEntity';
import EntityNotFoundError from '../exceptions/EntityNotFoundError';
import Andamento from '../models/Andamento';
import IRepository from './IRepository';

@Singleton
export default class AndamentoRepository extends IRepository {

    public async getAllAndamentos(): Promise<Andamento[]> {
        return this.getAndamentoRepository()
            .find({
                alias: "andamento",
                leftJoinAndSelect: {
                    tipoSpesa: "andamento.tipoSpesa",
                },
            });
    }

    public async findAndamentoById(id: number): Promise<Andamento> {
        const result = await this.getAndamentoRepository()
            .findOneById(id, {
                alias: "andamento",
                leftJoinAndSelect: {
                    director: "andamento.tipoSpesa",
                },
            });
        if (!result) {
            throw new EntityNotFoundError();
        }
        return result;
    }

    public async saveAndamento(andamento: Andamento): Promise<Andamento> {
        const director = await this.getTipoSpesaRepository().findOneById(andamento.$tipoSpesa.$id);
        if (!director) {
            throw new BadRequestEntity("No tipoSpesa found for this ID: " + andamento.$tipoSpesa.$id);
        }
        return this.getAndamentoRepository().persist(andamento);
    }

    public async deleteAndamento(id: number): Promise<void> {
        const andamento = await this.getAndamentoRepository().findOneById(id);
        if (!andamento) {
            throw new EntityNotFoundError("No andamento found with this ID");
        }
        await this.getAndamentoRepository()
            .createQueryBuilder("andamento")
            .delete()
            .where("andamento.id = :id", { id })
            .execute();
        return Promise.resolve();
    }

    public async deleteAndamentosFromTipoSpesa(tipoSpesaId: number): Promise<void> {
        await this.getAndamentoRepository()
            .createQueryBuilder("andamento")
            .delete()
            .where("andamento.tipoSpesa.id = :tipoSpesaId", { tipoSpesaId })
            .execute();
        return Promise.resolve();
    }

}

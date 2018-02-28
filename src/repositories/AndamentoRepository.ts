import { Singleton } from 'typescript-ioc';

import BadRequestEntity from '../exceptions/BadRequestEntity';
import EntityNotFoundError from '../exceptions/EntityNotFoundError';
import Andamento from '../models/Andamento';
import { Statistica } from '../models/statistica';
import { Interval } from '../models/interval';
import IRepository from './IRepository';

@Singleton
export default class AndamentoRepository extends IRepository {

    public async getAllAndamentos(): Promise<Andamento[]> {
        return this.getAndamentoRepository()
            .createQueryBuilder("andamento")
            .innerJoinAndSelect("andamento.tipoSpesa", "tipoSpesa")
            .orderBy("giorno", "DESC")
            .getMany();
    }

    public async findAndamentoById(id: number): Promise<Andamento> {
        const result = await this.getAndamentoRepository()
            .findOneById(id, {
                relations: ["tipoSpesa"],
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
        return this.getAndamentoRepository().save(andamento);
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

    // statistiche
    public async speseFrequenti(interval: Interval): Promise<Statistica> {
        let whereCondition = '';
        switch (interval) {
            case Interval.mese:
                whereCondition = "WHERE giorno > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case Interval.anno:
                whereCondition = "WHERE giorno > DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                break;
            default:
                break;
        }
        return this.getAndamentoRepository()
            .query(`SELECT ts.descrizione AS name, SUM(a.costo) AS value
                    FROM andamento a JOIN tipo_spesa ts ON a.tipo_spesa_id = ts.id
                    ${whereCondition}
                    GROUP BY a.tipo_spesa_id
                    ORDER BY value DESC
            `);
    }

    public async spesaMensile(): Promise<Statistica> {
        return this.getAndamentoRepository()
            .query(`SELECT * FROM (
                        SELECT DATE_FORMAT(giorno,'%Y%m') mese, UCASE(DATE_FORMAT(giorno,'%M %Y')) name, SUM(costo) AS value
                        FROM andamento
                        WHERE tipo_spesa_id = 1
                        GROUP BY mese, name
                        ORDER BY mese DESC
                        LIMIT 24
                    ) rev
                    ORDER BY mese
            `);
    }

}

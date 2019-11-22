import { Singleton } from 'typescript-ioc';
import BadRequestEntity from '../exceptions/bad-request-entity.error';
import EntityNotFoundError from '../exceptions/entity-not-found.error';
import Andamento from '../models/andamento';
import { Interval } from '../models/interval';
import { IStatistica } from '../models/statistica';
import IRepository from './repository';

@Singleton
export default class AndamentoRepository extends IRepository {

  public async getAllAndamentos(): Promise<Andamento[]> {
    return this.getAndamentoRepository()
      .createQueryBuilder('andamento')
      .innerJoinAndSelect('andamento.tipoSpesa', 'tipoSpesa')
      .orderBy('giorno', 'DESC')
      .getMany();
  }

  public async findAndamentoById(id: number): Promise<Andamento> {
    const result = await this.getAndamentoRepository()
      .findOne(id, {
        relations: ['tipoSpesa'],
      });
    if (!result) {
      throw new EntityNotFoundError();
    }
    return result;
  }

  public async saveAndamento(andamento: Andamento): Promise<Andamento> {
    const tipoSpesa = await this.getTipoSpesaRepository().findOne(andamento.$tipoSpesa.$id);
    if (!tipoSpesa) {
      throw new BadRequestEntity('No tipoSpesa found for this ID: ' + andamento.$tipoSpesa.$id);
    }
    return this.getAndamentoRepository().save(andamento);
  }

  public async deleteAndamento(id: number): Promise<void> {
    const andamento = await this.getAndamentoRepository().findOne(id);
    if (!andamento) {
      throw new EntityNotFoundError('No andamento found with this ID');
    }
    await this.getAndamentoRepository()
      .createQueryBuilder('andamento')
      .delete()
      .where('andamento.id = :id', { id })
      .execute();
    return Promise.resolve();
  }

  public async deleteAndamentosFromTipoSpesa(tipoSpesaId: number): Promise<void> {
    await this.getAndamentoRepository()
      .createQueryBuilder('andamento')
      .delete()
      .where('andamento.tipoSpesa.id = :tipoSpesaId', { tipoSpesaId })
      .execute();
    return Promise.resolve();
  }

  // statistiche
  public async speseFrequenti(interval: Interval): Promise<IStatistica> {
    let whereCondition = '';
    switch (interval) {
      case Interval.mese:
        whereCondition = "WHERE giorno > NOW() - interval '1 MONTH'";
        break;
      case Interval.anno:
        whereCondition = "WHERE giorno > NOW() - interval '1 YEAR'";
        break;
      default:
        break;
    }
    return this.getAndamentoRepository()
      .query(`SELECT ts.descrizione AS name, SUM(a.costo) AS value
          FROM gc.andamento a JOIN gc.tipo_spesa ts ON a.tipo_spesa_id = ts.id
          ${whereCondition}
          GROUP BY ts.id, ts.descrizione
          ORDER BY value DESC
      `);
  }

  public async spesa(interval: Interval): Promise<IStatistica> {
    let query = '';
    switch (interval) {
      case Interval.mese:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYYMM') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 1
          GROUP BY name
          ORDER BY name DESC
          LIMIT 48
        ) rev
        ORDER BY name`;
        break;
      case Interval.anno:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYY') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 1
          GROUP BY name
          ORDER BY name DESC
        ) rev
        ORDER BY name`;
        break;
      default:
        break;
    }
    return this.getAndamentoRepository().query(query);
  }

  public async carburante(interval: Interval): Promise<IStatistica> {
    let query = '';
    switch (interval) {
      case Interval.mese:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYYMM') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 2
          GROUP BY name
          ORDER BY name DESC
          LIMIT 48
        ) rev
        ORDER BY name`;
        break;
      case Interval.anno:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYY') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 2
          GROUP BY name
          ORDER BY name DESC
        ) rev
        ORDER BY name`;
        break;
      default:
        break;
    }
    return this.getAndamentoRepository().query(query);
  }

  public async bolletta(interval: Interval): Promise<IStatistica> {
    let query = '';
    switch (interval) {
      case Interval.mese:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYYMM') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 3
          GROUP BY name
          ORDER BY name DESC
          LIMIT 48
        ) rev
        ORDER BY name`;
        break;
      case Interval.anno:
        query = `SELECT * FROM (
          SELECT to_char(giorno, 'YYYY') as name, SUM(costo) AS value
          FROM gc.andamento
          WHERE tipo_spesa_id = 3
          GROUP BY name
          ORDER BY name DESC
        ) rev
        ORDER BY name`;
        break;
      default:
        break;
    }
    return this.getAndamentoRepository().query(query);
  }

}

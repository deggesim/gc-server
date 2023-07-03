import { Singleton } from "typescript-ioc";
import BadRequestEntity from "../exceptions/bad-request-entity.error";
import EntityNotFoundError from "../exceptions/entity-not-found.error";
import Andamento from "../models/andamento";
import { Interval } from "../models/interval";
import { IStatistica } from "../models/statistica";
import IRepository from "./repository";

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
    const result = await this.getAndamentoRepository().findOne(id, {
      relations: ["tipoSpesa"],
    });
    if (!result) {
      throw new EntityNotFoundError();
    }
    return result;
  }

  public async saveAndamento(andamento: Andamento): Promise<Andamento> {
    const tipoSpesa = await this.getTipoSpesaRepository().findOne(
      andamento.$tipoSpesa.$id
    );
    if (!tipoSpesa) {
      throw new BadRequestEntity(
        "No tipoSpesa found for this ID: " + andamento.$tipoSpesa.$id
      );
    }
    return this.getAndamentoRepository().save(andamento);
  }

  public async deleteAndamento(id: number): Promise<void> {
    const andamento = await this.getAndamentoRepository().findOne(id);
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

  public async deleteAndamentosFromTipoSpesa(
    tipoSpesaId: number
  ): Promise<void> {
    await this.getAndamentoRepository()
      .createQueryBuilder("andamento")
      .delete()
      .where("andamento.tipoSpesa.id = :tipoSpesaId", { tipoSpesaId })
      .execute();
    return Promise.resolve();
  }

  // statistiche
  public async speseFrequenti(interval: Interval): Promise<IStatistica> {
    let whereCondition = "";
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

  getQuery = (tipoSpesa: number, interval: Interval): string => {
    let query = "";
    switch (interval) {
      case Interval.mese:
        query = `
        with filtered_andamento as (
            select
                *
            from
                gc.andamento
            where
                gc.andamento.tipo_spesa_id = ${tipoSpesa}),
            months as (
            select
                generate_series(min_month, max_month, '1 month') as month
            from
                (
                select
                    date_trunc('year', min(giorno)) as min_month,
                    date_trunc('month', max(giorno)) as max_month
                from
                    gc.andamento
                ) s ) 
            select
                to_char(date_trunc('month', m.month), 'YYYYMM') as name,
                coalesce(sum(costo), 0) as value
            from
                filtered_andamento
            right join
                months m on
                date_trunc('month', filtered_andamento.giorno) = m.month
            group by
                m.month
            order by
                m.month desc
            limit 48
        `;
        break;
      case Interval.anno:
        query = `
        with filtered_andamento as (
            select
                *
            from
                gc.andamento
            where
                gc.andamento.tipo_spesa_id = ${tipoSpesa}),
            years as (
            select
                generate_series(min_year, max_year, '1 year') as anno
            from
                (
                select
                    date_trunc('year', min(giorno)) as min_year,
                    date_trunc('year', max(giorno)) as max_year
                from
                    gc.andamento
                ) s ) 
            select
                to_char(date_trunc('year', y.anno), 'YYYY') as name,
                coalesce(sum(costo), 0) as value
            from
                filtered_andamento
            right join
                years y on
                date_trunc('year', filtered_andamento.giorno) = y.anno
            group by
                y.anno
            order by
                y.anno desc
        `;
      default:
        break;
    }
    return query;
  };

  public async statistics(
    tipoSpesa: number,
    interval: Interval
  ): Promise<IStatistica> {
    return this.getAndamentoRepository().query(
      this.getQuery(tipoSpesa, interval)
    );
  }
}

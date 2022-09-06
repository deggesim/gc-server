import { DateTime } from "luxon";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import TipoSpesa from "./tipo-spesa";

@Entity()
export default class Andamento {
  @PrimaryGeneratedColumn()
  private id!: number;

  @Column({ type: "date", nullable: false })
  private giorno!: string;

  @Column({ nullable: false })
  private descrizione!: string;

  @Column("decimal", { nullable: false })
  private costo!: number;

  @ManyToOne((type) => TipoSpesa, { nullable: false })
  @JoinColumn({ name: "tipo_spesa_id" })
  private tipoSpesa!: TipoSpesa;

  public static newAndamento(obj: {
    id?: number;
    giorno?: string;
    descrizione?: string;
    costo?: number;
    tipoSpesa?: object;
  }): Andamento {
    const andamento = new Andamento();
    if (obj.id) {
      andamento.id = obj.id;
    }
    if (obj.giorno) {
      andamento.giorno = obj.giorno;
    }
    if (obj.descrizione) {
      andamento.descrizione = obj.descrizione;
    }
    if (obj.costo) {
      andamento.costo = obj.costo;
    }
    if (obj.tipoSpesa) {
      andamento.tipoSpesa = TipoSpesa.newTipoSpesa(obj.tipoSpesa);
    }
    return andamento;
  }

  public get $id(): number {
    return this.id;
  }

  public set $id(id: number) {
    this.id = id;
  }

  public get $giorno(): string {
    return this.giorno;
  }

  public set $giorno(value: string) {
    this.giorno = value;
  }

  public get $descrizione(): string {
    return this.descrizione;
  }

  public set $descrizione(value: string) {
    this.descrizione = value;
  }

  public get $costo(): number {
    return this.costo;
  }

  public set $costo(value: number) {
    this.costo = value;
  }

  public get $tipoSpesa(): TipoSpesa {
    return this.tipoSpesa;
  }

  public set $tipoSpesa(value: TipoSpesa) {
    this.tipoSpesa = value;
  }
}

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
  id?: number;

  @Column({ type: "date", nullable: false })
  giorno!: string;

  @Column({ nullable: false })
  descrizione!: string;

  @Column("decimal", { nullable: false })
  costo!: number;

  @ManyToOne((type) => TipoSpesa, { nullable: false })
  @JoinColumn({ name: "tipo_spesa_id" })
  tipoSpesa!: TipoSpesa;
}

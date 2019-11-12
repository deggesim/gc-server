import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Utente from "./utente";

@Entity()
export default class Token {

    @PrimaryGeneratedColumn()
    private id!: number;

    @Column({ nullable: false })
    private token!: string;

    @ManyToOne((type) => Utente, { nullable: false })
    @JoinColumn({ name: "utente_id" })
    private utente!: Utente;

    public get $id(): number {
        return this.id;
    }

    public set $id(value: number) {
        this.id = value;
    }

    public get $token(): string {
        return this.token;
    }

    public set $token(value: string) {
        this.token = value;
    }

    public get $utente(): Utente {
        return this.utente;
    }

    public set $utente(value: Utente) {
        this.utente = value;
    }
}

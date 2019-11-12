import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Token from "./token";

@Entity()
export default class Utente {

    @PrimaryGeneratedColumn()
    private id!: number;

    @Column({ nullable: false })
    private email!: string;

    @Column({ nullable: false })
    private password!: string;

    @OneToMany((type) => Token, (token) => token.$utente)
    private tokens!: string[];

    public get $id(): number {
        return this.id;
    }

    public set $id(value: number) {
        this.id = value;
    }

    public get $email(): string {
        return this.email;
    }

    public set $email(value: string) {
        this.email = value;
    }

    public get $password(): string {
        return this.password;
    }

    public set $password(value: string) {
        this.password = value;
    }

    public get $tokens(): string[] {
        return this.tokens;
    }

    public set $tokens(value: string[]) {
        this.tokens = value;
    }

}

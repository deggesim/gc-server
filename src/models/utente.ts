import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Token from './token';

@Entity()
export default class Utente {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ nullable: false })
    public email!: string;

    @Column({ nullable: false })
    public password!: string;

    @OneToMany((type) => Token, (token) => token.utente, { eager: true })
    public tokens!: Token[];

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

    public get $tokens(): Token[] {
        return this.tokens;
    }

    public set $tokens(value: Token[]) {
        this.tokens = value;
    }

}

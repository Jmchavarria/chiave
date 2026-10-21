import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792612916442 implements MigrationInterface {
    name = 'AutoMigration1792612916442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "title" character varying(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "title"`);
    }

}

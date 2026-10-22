import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792635891162 implements MigrationInterface {
    name = 'AutoMigration1792635891162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "username" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "website" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "notes" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "username"`);
    }

}

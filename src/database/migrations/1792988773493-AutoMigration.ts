import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792988773493 implements MigrationInterface {
    name = 'AutoMigration1792988773493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "passwordHash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "passwordHash"`);
    }

}

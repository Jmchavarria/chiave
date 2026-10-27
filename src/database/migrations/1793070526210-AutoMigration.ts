import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1793070526210 implements MigrationInterface {
    name = 'AutoMigration1793070526210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" ADD "is_archived" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "is_archived"`);
    }

}

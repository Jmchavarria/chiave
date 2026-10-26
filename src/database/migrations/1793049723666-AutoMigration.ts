import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1793049723666 implements MigrationInterface {
    name = 'AutoMigration1793049723666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "UQ_73601e03a45f6f44d5aeab67374" UNIQUE ("user_id", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "UQ_73601e03a45f6f44d5aeab67374"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "folders" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folders" RENAME COLUMN "user_id" TO "userId"`);
    }

}

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1792557148076 implements MigrationInterface {
  name = 'AutoMigration1792557148076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_items" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "deleted_at"`);
  }
}

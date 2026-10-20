import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792464459309 implements MigrationInterface {
    name = 'AutoMigration1792464459309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."vault_items_type_enum" AS ENUM('LOGIN', 'NOTE', 'CARD')`);
        await queryRunner.query(`CREATE TABLE "vault_items" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "type" "public"."vault_items_type_enum" NOT NULL DEFAULT 'LOGIN', "is_favorite" boolean NOT NULL DEFAULT false, "encrypted_data" text NOT NULL, "iv" character varying(64) NOT NULL, "auth_tag" character varying(64) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5f8f06333e32f168cfce6f3158f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48f3d8c9c749a17508870be1d9" ON "vault_items" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD CONSTRAINT "FK_48f3d8c9c749a17508870be1d90" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" DROP CONSTRAINT "FK_48f3d8c9c749a17508870be1d90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48f3d8c9c749a17508870be1d9"`);
        await queryRunner.query(`DROP TABLE "vault_items"`);
        await queryRunner.query(`DROP TYPE "public"."vault_items_type_enum"`);
    }

}

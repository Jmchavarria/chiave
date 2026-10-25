import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792879357183 implements MigrationInterface {
    name = 'AutoMigration1792879357183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_48f3d8c9c749a17508870be1d9"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "is_favorite"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "encrypted_data"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "iv"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "auth_tag"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "folderId" integer`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "isFavorite" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "secretValue" text`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "authenticatorKey" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "cardholderName" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "brand" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "number" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "expMonth" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "expYear" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "code" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "identityTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "middleName" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "identityUsername" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "company" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "ssn" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "passportNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "passportExpDate" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "licenseNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "identityEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "address1" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "address2" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "postalCode" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "publicKey" text`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "privateKey" text`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."vault_items_type_enum" RENAME TO "vault_items_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."vault_items_type_enum" AS ENUM('LOGIN', 'CARD', 'IDENTITY', 'SECURE_NOTE', 'SSH_KEY')`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" TYPE "public"."vault_items_type_enum" USING "type"::"text"::"public"."vault_items_type_enum"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" SET DEFAULT 'LOGIN'`);
        await queryRunner.query(`DROP TYPE "public"."vault_items_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "website" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "website" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "username" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "title" character varying(150) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."vault_items_type_enum_old" AS ENUM('LOGIN', 'NOTE', 'CARD')`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" TYPE "public"."vault_items_type_enum_old" USING "type"::"text"::"public"."vault_items_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ALTER COLUMN "type" SET DEFAULT 'LOGIN'`);
        await queryRunner.query(`DROP TYPE "public"."vault_items_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."vault_items_type_enum_old" RENAME TO "vault_items_type_enum"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "privateKey"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "publicKey"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "address2"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "address1"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "identityEmail"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "licenseNumber"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "passportExpDate"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "passportNumber"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "ssn"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "company"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "identityUsername"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "middleName"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "identityTitle"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "expYear"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "expMonth"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "cardholderName"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "authenticatorKey"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "secretValue"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "isFavorite"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP COLUMN "folderId"`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "auth_tag" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "iv" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "encrypted_data" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD "is_favorite" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_48f3d8c9c749a17508870be1d9" ON "vault_items" ("user_id") `);
    }

}

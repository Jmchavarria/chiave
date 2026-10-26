import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1792986869366 implements MigrationInterface {
    name = 'AutoMigration1792986869366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."vault_items_type_enum" AS ENUM('LOGIN', 'CARD', 'IDENTITY', 'SECURE_NOTE', 'SSH_KEY')`);
        await queryRunner.query(`CREATE TABLE "vault_items" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "folderId" integer, "type" "public"."vault_items_type_enum" NOT NULL DEFAULT 'LOGIN', "title" character varying NOT NULL, "isFavorite" boolean NOT NULL DEFAULT false, "notes" text, "username" character varying, "authenticatorKey" character varying, "website" text, "cardholderName" character varying, "brand" character varying, "number" character varying, "expMonth" character varying, "expYear" character varying, "cvv" character varying, "courtesyTitle" character varying, "firstName" character varying, "middleName" character varying, "lastName" character varying, "identityUsername" character varying, "company" character varying, "ssn" character varying, "passportNumber" character varying, "licenseNumber" character varying, "email" character varying, "phone" character varying, "address1" character varying, "address2" character varying, "address3" character varying, "city" character varying, "state" character varying, "postalCode" character varying, "country" character varying, "publicKey" text, "privateKey" text, "fingerPrint" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5f8f06333e32f168cfce6f3158f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(254) NOT NULL, "password_hash" character varying(255) NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'PENDING_VERIFICATION', "email_verified_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "email_verification_tokens" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_email_verification_tokens_user_id" ON "email_verification_tokens" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_email_verification_tokens_token_hash" ON "email_verification_tokens" ("token_hash") `);
        await queryRunner.query(`CREATE TABLE "refresh_token_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" integer NOT NULL, "jti" character varying(36) NOT NULL, "token_hash" character varying(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_69bc960573ea7449fefeeda45ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_token_sessions_user_id" ON "refresh_token_sessions" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_refresh_token_sessions_jti" ON "refresh_token_sessions" ("jti") `);
        await queryRunner.query(`ALTER TABLE "vault_items" ADD CONSTRAINT "FK_48f3d8c9c749a17508870be1d90" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "FK_fdcb77f72f529bf65c95d72a147" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "FK_fdcb77f72f529bf65c95d72a147"`);
        await queryRunner.query(`ALTER TABLE "vault_items" DROP CONSTRAINT "FK_48f3d8c9c749a17508870be1d90"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_refresh_token_sessions_jti"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_token_sessions_user_id"`);
        await queryRunner.query(`DROP TABLE "refresh_token_sessions"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_email_verification_tokens_token_hash"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_email_verification_tokens_user_id"`);
        await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "vault_items"`);
        await queryRunner.query(`DROP TYPE "public"."vault_items_type_enum"`);
    }

}

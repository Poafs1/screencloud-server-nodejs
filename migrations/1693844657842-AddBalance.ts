import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalance1693844657842 implements MigrationInterface {
  name = 'AddBalance1693844657842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "balance" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "pin" character varying NOT NULL, "balance" integer NOT NULL, CONSTRAINT "UQ_57bfbcf3539b4604105bd095878" UNIQUE ("pin"), CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balance"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMachineBalance1693844705117 implements MigrationInterface {
  name = 'AddMachineBalance1693844705117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "machine_balance" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "note" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "UQ_a6255fc2ff3a20d97d31cbb2b4d" UNIQUE ("note"), CONSTRAINT "PK_b314b1936283ca082d409ce3e94" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "machine_balance"`);
  }
}

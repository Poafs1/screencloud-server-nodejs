import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToBalanceAndMachineBalance1693928542840 implements MigrationInterface {
  name = 'AddIndexToBalanceAndMachineBalance1693928542840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_57bfbcf3539b4604105bd09587" ON "balance" ("pin") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_a6255fc2ff3a20d97d31cbb2b4" ON "machine_balance" ("note") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_a6255fc2ff3a20d97d31cbb2b4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57bfbcf3539b4604105bd09587"`);
  }
}

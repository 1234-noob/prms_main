import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1741593131111 implements MigrationInterface {
    name = 'InitialMigration1741593131111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`properties\` (\`id\` int NOT NULL AUTO_INCREMENT, \`organization_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`organization_name\` varchar(255) NOT NULL, \`location\` varchar(255) NULL, \`splitable\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`property_parts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`part_name\` varchar(255) NOT NULL, \`status\` enum ('Available', 'Rented') NOT NULL DEFAULT 'Available', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`propertyIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`property_parts\` ADD CONSTRAINT \`FK_fda84cdf20e3e2331e64c153be5\` FOREIGN KEY (\`propertyIdId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`property_parts\` DROP FOREIGN KEY \`FK_fda84cdf20e3e2331e64c153be5\``);
        await queryRunner.query(`DROP TABLE \`property_parts\``);
        await queryRunner.query(`DROP TABLE \`properties\``);
    }

}

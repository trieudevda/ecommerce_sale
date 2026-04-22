import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDB1776800273168 implements MigrationInterface {
    name = 'UpdateDB1776800273168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`user_id\` varchar(36) NOT NULL, \`permissions_id\` int NOT NULL, INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` (\`user_id\`), INDEX \`IDX_bead51779ff0427fd83ad672ef\` (\`permissions_id\`), PRIMARY KEY (\`user_id\`, \`permissions_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role_id\` \`role_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_fb2e442d14add3cefbdf33c456\` (\`role_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_fb2e442d14add3cefbdf33c456\` ON \`user\` (\`role_id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_3495bd31f1862d02931e8e8d2e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_bead51779ff0427fd83ad672ef9\` FOREIGN KEY (\`permissions_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_bead51779ff0427fd83ad672ef9\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_3495bd31f1862d02931e8e8d2e8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`DROP INDEX \`REL_fb2e442d14add3cefbdf33c456\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_fb2e442d14add3cefbdf33c456\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role_id\` \`role_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_bead51779ff0427fd83ad672ef\` ON \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` ON \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
    }

}

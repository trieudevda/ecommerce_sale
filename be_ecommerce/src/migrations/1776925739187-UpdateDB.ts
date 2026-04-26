import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDB1776925739187 implements MigrationInterface {
    name = 'UpdateDB1776925739187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NULL, \`fullName\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`dateOfBirth\` timestamp NULL, \`isEmailVerified\` tinyint NOT NULL DEFAULT 0, \`lastLoginAt\` datetime NULL, \`status\` enum ('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role_id\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions\` (\`role_id\` int NOT NULL, \`permission_id\` int NOT NULL, INDEX \`IDX_178199805b901ccd220ab7740e\` (\`role_id\`), INDEX \`IDX_17022daf3f885f7d35423e9971\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`user_id\` varchar(36) NOT NULL, \`permissions_id\` int NOT NULL, INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` (\`user_id\`), INDEX \`IDX_bead51779ff0427fd83ad672ef\` (\`permissions_id\`), PRIMARY KEY (\`user_id\`, \`permissions_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_178199805b901ccd220ab7740ec\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_17022daf3f885f7d35423e9971e\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_3495bd31f1862d02931e8e8d2e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_bead51779ff0427fd83ad672ef9\` FOREIGN KEY (\`permissions_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_bead51779ff0427fd83ad672ef9\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_3495bd31f1862d02931e8e8d2e8\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_17022daf3f885f7d35423e9971e\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_178199805b901ccd220ab7740ec\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_bead51779ff0427fd83ad672ef\` ON \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` ON \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_17022daf3f885f7d35423e9971\` ON \`role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_178199805b901ccd220ab7740e\` ON \`role_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

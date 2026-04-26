import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDB1777000247388 implements MigrationInterface {
    name = 'UpdateDB1777000247388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`sortOrder\` int NOT NULL DEFAULT '0', \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`alt\` varchar(255) NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`sortOrder\` int NOT NULL DEFAULT '0', \`refId\` int NOT NULL, \`refType\` enum ('user', 'product', 'none') NOT NULL DEFAULT 'none', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role_id\` \`role_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`short_description\` \`short_description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` DROP FOREIGN KEY \`FK_a16d35fd18ba21ee968a0081625\``);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`startDate\` \`startDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`endDate\` \`endDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`variant_id\` \`variant_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_6343513e20e2deab45edfce1316\``);
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_db2d0ea722e16e0fe8ab3bce111\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`order_id\` \`order_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`variant_id\` \`variant_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_f5221735ace059250daac9d9803\``);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`paymentMethod\` \`paymentMethod\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`order_id\` \`order_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` ADD CONSTRAINT \`FK_a16d35fd18ba21ee968a0081625\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` ADD CONSTRAINT \`FK_6343513e20e2deab45edfce1316\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_4f166bb8c2bfcef2498d97b4068\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_db2d0ea722e16e0fe8ab3bce111\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_f5221735ace059250daac9d9803\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_f5221735ace059250daac9d9803\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_db2d0ea722e16e0fe8ab3bce111\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_4f166bb8c2bfcef2498d97b4068\``);
        await queryRunner.query(`ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_6343513e20e2deab45edfce1316\``);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` DROP FOREIGN KEY \`FK_a16d35fd18ba21ee968a0081625\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_fb2e442d14add3cefbdf33c4561\``);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`order_id\` \`order_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`paymentMethod\` \`paymentMethod\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_f5221735ace059250daac9d9803\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`variant_id\` \`variant_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_items\` CHANGE \`order_id\` \`order_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_db2d0ea722e16e0fe8ab3bce111\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`product_id\` \`product_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` ADD CONSTRAINT \`FK_6343513e20e2deab45edfce1316\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`variant_id\` \`variant_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`endDate\` \`endDate\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` CHANGE \`startDate\` \`startDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`product_price_history\` ADD CONSTRAINT \`FK_a16d35fd18ba21ee968a0081625\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`short_description\` \`short_description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role_id\` \`role_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLoginAt\` \`lastLoginAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_fb2e442d14add3cefbdf33c4561\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`module\` \`module\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
    }

}

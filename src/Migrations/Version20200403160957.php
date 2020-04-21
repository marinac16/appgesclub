<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200403160957 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE member ADD gender_id INT NOT NULL, ADD category_id INT NOT NULL');
        $this->addSql('ALTER TABLE member ADD CONSTRAINT FK_70E4FA78708A0E0 FOREIGN KEY (gender_id) REFERENCES gender (id)');
        $this->addSql('ALTER TABLE member ADD CONSTRAINT FK_70E4FA7812469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_70E4FA78708A0E0 ON member (gender_id)');
        $this->addSql('CREATE INDEX IDX_70E4FA7812469DE2 ON member (category_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE member DROP FOREIGN KEY FK_70E4FA78708A0E0');
        $this->addSql('ALTER TABLE member DROP FOREIGN KEY FK_70E4FA7812469DE2');
        $this->addSql('DROP INDEX IDX_70E4FA78708A0E0 ON member');
        $this->addSql('DROP INDEX IDX_70E4FA7812469DE2 ON member');
        $this->addSql('ALTER TABLE member DROP gender_id, DROP category_id');
    }
}

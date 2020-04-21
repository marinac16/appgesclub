<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Club;
use App\Entity\Gender;
use App\Entity\Member;
use App\Entity\Status;
use App\Entity\Team;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**@var UserPasswordEncoderInterface */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;

    }

    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $numTeam = 1;

        $faker = Factory::create('fr_FR');

        for ($c = 0; $c < 1; $c++) {
            $club = new Club();
            $club->setName('Treillières Basket Club');
            $club->setRef('CL0001');
            $manager->persist($club);

            for ($u = 0; $u < 1; $u++) {
                $user = new User();
                $user->setEmail('marina@email.fr');
                $hash = $this->encoder->encodePassword($user, "marina");
                $user->setPassword($hash);
                $user->setRoles(['ROLE_ADMIN']);
                $user->setClub($club);
                $manager->persist($user);

                $gens = ['Feminin', 'Masculin'];
                foreach ($gens as $gen) {
                    $gender = new Gender();
                    $gender->setType($gen);
                    $manager->persist($gender);

                    $cats = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U18', 'U20', 'Seniors', 'Loisirs'];
                    foreach ($cats as $cat) {
                        $category = new Category();
                        $category->setName($cat);
                        $category->setGender($gender);
                        $manager->persist($category);

                        for ($t = 0; $t < mt_rand(1, 3); $t++) {
                            $team = new Team();
                            $team->setName("Team 00" . $numTeam);
                            $team->setCategory($category);
                            $team->setGender($gender);
                            $manager->persist($team);

                            $numTeam++;

                            for ($m = 0; $m < mt_rand(8, 10); $m++) {
                                $member = new Member();
                                $member->setFirstName($faker->firstName());
                                $member->setLastName($faker->lastName);
                                $member->setBirthDate($faker->dateTimeBetween('-30 years'));
                                $member->setPhoneNumber($faker->phoneNumber);
                                $member->setEmail($faker->email);
                                $member->setCategory($category);
                                $member->setGender($gender);
                                $member->setLicencieAuClub(true);
                                $member->addTeam($team);
                                $manager->persist($member);

                            }
                        }
                    }
                }
            }


        }

        $statuses = ['Joueur', 'Coach', 'Dirigeant', 'Bénévole'];
        foreach ($statuses as $status) {
            $statut = new Status();
            $statut->setName($status);
            $manager->persist($statut);
        }

        $manager->flush();
    }
}

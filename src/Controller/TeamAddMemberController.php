<?php

namespace App\Controller;

use App\Entity\Team;
use App\Repository\MemberRepository;
use Doctrine\ORM\EntityManagerInterface;

class TeamAddMemberController {

    /** @var EntityManagerInterface */
    private $manager;

    /** @var MemberRepository */
    private $memberRepo;

    public function __construct(EntityManagerInterface $manager, MemberRepository $memberRepo)
    {
        $this->manager = $manager;
        $this->memberRepo = $memberRepo;
    }

    /**
     * @param $id
     * @param Team $data
     * @return Team
     */
    public function  __invoke(Team $data, $id)
    {
        $member = $this->memberRepo->find($id);
        $data->addMember($member);

        $this->manager->flush();

        return $data;

    }
}
<?php

namespace App\Controller;

use App\Entity\Member;
use App\Repository\MemberRepository;
use Doctrine\ORM\EntityManagerInterface;

class FindByStatus {

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
     * @param Member $data
     * @return Member[]
     */
    public function  __invoke(Member $data)
    {
        $data = $this->memberRepo->findByStatus();

        return $data;

    }
}
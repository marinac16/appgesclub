<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Member;
use App\Repository\MemberRepository;
use DateInterval;
use DateTimeInterface;
use DateTimeZone;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class MemberGestionDate implements EventSubscriberInterface
{

    private $security;
    private $memberRepo;

    public function __construct(Security $security, MemberRepository $memberRepo)
    {
        $this->security = $security;
        $this->memberRepo = $memberRepo;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setDateForMember', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setDateForMember(ViewEvent $event) {
        //Resultat de notre demande
        $result = $event->getControllerResult();
        //récupération de la méthode utilisé (POST, GET, PIT, DELETE)
        $method = $event->getRequest()->getMethod();

        if($result instanceof Member && $method === "POST"){

            if(!empty($result->getBirthDate())){
                $result->setBirthDate($result->getBirthDate()->format('Y-m-d'));
            }
        }
    }


}








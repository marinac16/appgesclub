<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MatchRepository")
 * @Orm\Table(name="`Match`")
 * @ApiResource(
 *     normalizationContext={"groups"={"matchs_read"}
 *     },
 *     attributes={"pagination_enabled"=false}
 *     )
 * )
 * @ApiFilter(BooleanFilter::class, properties={"home"})
 * @ApiFilter(SearchFilter::class, properties={"weekend"})
 */
class Match
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $refMatch;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $location;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Team", inversedBy="matches")
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $teamLocal;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $teamOpponent;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $startTime;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $home;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Weekend", inversedBy="matches")
     * @Groups({"matchs_read"})
     */
    private $weekend;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Member", inversedBy="matchesReferentClub")
     * @Groups({"matchs_read", "weekends_read"})
     */
    private $referentClub;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Member", inversedBy="matches")
     */
    private $referees;




    public function __construct()
    {
        $this->referees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeamLocal(): ?Team
    {
        return $this->teamLocal;
    }

    public function setTeamLocal(?Team $teamLocal): self
    {
        $this->teamLocal = $teamLocal;

        return $this;
    }

    public function getTeamOpponent(): ?string
    {
        return $this->teamOpponent;
    }

    public function setTeamOpponent(string $teamOpponent): self
    {
        $this->teamOpponent = $teamOpponent;

        return $this;
    }

    public function getStartTime(): ?string
    {
        return $this->startTime;
    }

    public function setStartTime(string $startTime): self
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getHome(): ?bool
    {
        return $this->home;
    }

    public function setHome(?bool $home): self
    {
        $this->home = $home;

        return $this;
    }


    public function getWeekend(): ?Weekend
    {
        return $this->weekend;
    }

    public function setWeekend(?Weekend $weekend): self
    {
        $this->weekend = $weekend;

        return $this;
    }

    public function getRefMatch(): ?string
    {
        return $this->refMatch;
    }

    public function setRefMatch(string $refMatch): self
    {
        $this->refMatch = $refMatch;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;

        return $this;
    }

    public function setReferees($referees): void
    {
        $this->referees = $referees;
    }

    public function setScorers($scorers): void
    {
        $this->scorers = $scorers;
    }

    public function getReferentClub(): ?Member
    {
        return $this->referentClub;
    }

    public function setReferentClub(?Member $referentClub): self
    {
        $this->referentClub = $referentClub;

        return $this;
    }

    /**
     * @return Collection|Member[]
     */
    public function getReferees(): Collection
    {
        return $this->referees;
    }

    public function addReferee(Member $referee): self
    {
        if (!$this->referees->contains($referee)) {
            $this->referees[] = $referee;
        }

        return $this;
    }

    public function removeReferee(Member $referee): self
    {
        if ($this->referees->contains($referee)) {
            $this->referees->removeElement($referee);
        }

        return $this;
    }


}

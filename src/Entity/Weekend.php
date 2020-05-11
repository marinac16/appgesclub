<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\WeekendRepository")
 * @Orm\Table(name="`Weekend`")
 * @ApiResource(
 *     normalizationContext={"groups"={"weekends_read"}
 *     },
 *     attributes={"pagination_enabled"=false}
 *     )
 * )
 */
class Weekend
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"weekends_read", "matchs_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"weekends_read", "matchs_read"})
     */
    private $name;

    /**
     * @ORM\Column(type="date")
     * @Groups({"weekends_read"})
     */
    private $beginDate;

    /**
     * @ORM\Column(type="date")
     * @Groups({"weekends_read"})
     */
    private $endDate;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Match", mappedBy="weekend", cascade={"persist", "remove"})
     * @Groups({"weekends_read"})
     */
    private $matches;

    public function __construct()
    {
        $this->matches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getBeginDate(): ?\DateTimeInterface
    {
        return $this->beginDate;
    }

    public function setBeginDate(\DateTimeInterface $beginDate): self
    {
        $this->beginDate = $beginDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * @return Collection|Match[]
     */
    public function getMatches(): Collection
    {
        return $this->matches;
    }

    public function addMatch(Match $match): self
    {
        if (!$this->matches->contains($match)) {
            $this->matches[] = $match;
            $match->setWeekend($this);
        }

        return $this;
    }

    public function removeMatch(Match $match): self
    {
        if ($this->matches->contains($match)) {
            $this->matches->removeElement($match);
            // set the owning side to null (unless already changed)
            if ($match->getWeekend() === $this) {
                $match->setWeekend(null);
            }
        }

        return $this;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TeamRepository")
 * @ApiResource(
 *     normalizationContext={
        "groups"={"teams_read"}
 *     },
 * )
 * @ApiFilter(SearchFilter::class, properties={"gender.type"})
 *
 *
 */
class Team
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read", "genders_read", "categories_read", "members_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"teams_read", "genders_read", "categories_read", "members_read"})
     * @Assert\NotBlank(message = "Le nom de l'équipe est obligatoire")
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="teams")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"teams_read", "members_read"})
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Gender", inversedBy="teams")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"teams_read", "members_read"})
     */
    private $gender;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Member", inversedBy="teams")
     * @ORM\JoinTable(name="teams_players")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"teams_read"})
     */
    private $players;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Member", inversedBy="teamsCoached")
     * @ORM\JoinTable(name="teams_coachs")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"teams_read"})
     */
    private $coachs;

    public function __construct()
    {
        $this->players = new ArrayCollection();
        $this->coachs = new ArrayCollection();
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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    /**
     * @return Collection|Member[]
     */
    public function getPlayers(): Collection
    {
        return $this->players;
    }

    public function addMember(Member $member): self
    {
        if (!$this->players->contains($member)) {
            $this->players[] = $member;
        }

        return $this;
    }

    public function removeMember(Member $member): self
    {
        if ($this->players->contains($member)) {
            $this->players->removeElement($member);
        }

        return $this;
    }

    /**
     * @return Collection|Member[]
     */
    public function getCoachs(): Collection
    {
        return $this->coachs;
    }

    public function addCoach(Member $coach): self
    {
        if (!$this->coachs->contains($coach)) {
            $this->coachs[] = $coach;
        }

        return $this;
    }

    public function removeCoach(Member $coach): self
    {
        if ($this->coachs->contains($coach)) {
            $this->coachs->removeElement($coach);
        }

        return $this;
    }


    public function setPlayers($players): void
    {
        $this->players = $players;
    }

    public function setCoachs($coachs): void
    {
        $this->coachs = $coachs;
    }






}

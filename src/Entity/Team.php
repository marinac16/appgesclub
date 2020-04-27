<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
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
 *     itemOperations={"GET", "PUT", "DELETE", "addMember"= {
 *      "method"="post",
 *     "path"="/teams/{id}/addMember",
 *     "controller"="App\Controller\TeamAddMemberController",
 *     "swagger_context"={
 *          "summary"="Ajout d'un joueur dans un équipe",
 *          "description"="Ajout d'un joueur dans un équipe"
 *     }}},
 *      attributes={"pagination_enabled"=false}
 *     )
 * )
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
     * @ORM\JoinTable(name="teams_members")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"teams_read"})
     */
    private $members;

    public function __construct()
    {
        $this->members = new ArrayCollection();
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
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(Member $member): self
    {
        if (!$this->members->contains($member)) {
            $this->members[] = $member;
        }

        return $this;
    }

    public function removeMember(Member $member): self
    {
        if ($this->members->contains($member)) {
            $this->members->removeElement($member);
        }

        return $this;
    }




}

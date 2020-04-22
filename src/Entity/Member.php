<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MemberRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"members_read"}
 *     },
 *     denormalizationContext={"disable_type_enforcement"=true},
 *     attributes={"pagination_enabled"=false}
 *     )
 * )
 *
 */
class Member
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"members_read", "genders_read", "teams_read", "categories_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"members_read", "genders_read", "teams_read", "categories_read"})
     * @Assert\NotBlank(message = "Le prénom est obligatoire")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"members_read", "genders_read", "teams_read", "categories_read"})
     * @Assert\NotBlank(message = "Le nom de famille est obligatoire")
     */
    private $lastName;

    /**
     * @ORM\Column(type="date")
     * @Groups({"members_read", "genders_read", "teams_read"})
     * @Assert\NotBlank(message = "La date de naissance est obligatoire")
     */
    private $birthDate;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"members_read", "teams_read"})
     */
    private $licenceNumber;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"members_read", "genders_read", "teams_read"})
     * @Assert\NotBlank(message = "Le numero de téléphone est obligatoire")
     */
    private $phoneNumber;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"members_read", "genders_read", "teams_read"})
     * @Assert\NotBlank(message = "L'email' est obligatoire")
     */
    private $email;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Gender", inversedBy="members")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"members_read"})
     */
    private $gender;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="members")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"members_read", "genders_read"})
     */
    private $category;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Team", mappedBy="members")
     * @Groups({"members_read"})
     */
    private $teams;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Status")
     * @ORM\JoinTable(name="member_status",
     * joinColumns={@ORM\JoinColumn(name="member_id", referencedColumnName="id")},
     * inverseJoinColumns={@ORM\JoinColumn(name="status_id", referencedColumnName="id", unique=true)})
     * @Groups({"members_read"})
     *
     */
    private $status;

    /**
     * @ORM\Column(type="boolean")
     */
    private $licencieAuClub;



    //**
     //* @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="members")
     //* @ORM\JoinColumn(nullable=true)
     //*/
    //private $user;

    public function __construct()
    {
        $this->teams = new ArrayCollection();
        $this->status = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): self
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection|Team[]
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): self
    {
        if (!$this->teams->contains($team)) {
            $this->teams[] = $team;
            $team->addMember($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): self
    {
        if ($this->teams->contains($team)) {
            $this->teams->removeElement($team);
            $team->removeMember($this);
        }

        return $this;
    }

    /**
     * @return Collection|Status[]
     */
    public function getStatus(): Collection
    {
        return $this->status;
    }

    public function addStatus(Status $status): self
    {
        if (!$this->status->contains($status)) {
            $this->status[] = $status;
        }

        return $this;
    }

    public function removeStatus(Status $status): self
    {
        if ($this->status->contains($status)) {
            $this->status->removeElement($status);
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email): void
    {
        $this->email = $email;
    }

    public function getLicenceNumber(): ?string
    {
        return $this->licenceNumber;
    }

    public function setLicenceNumber(?string $licenceNumber): self
    {
        $this->licenceNumber = $licenceNumber;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLicencieAuClub()
    {
        return $this->licencieAuClub;
    }

    /**
     * @param mixed $licencieAuClub
     */
    public function setLicencieAuClub($licencieAuClub): void
    {
        $this->licencieAuClub = $licencieAuClub;
    }




}
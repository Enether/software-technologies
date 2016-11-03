<?php

namespace SoftUniBlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Article
 *
 * @ORM\Table(name="articles")
 * @ORM\Entity(repositoryClass="SoftUniBlogBundle\Repository\ArticleRepository")
 */
class Article
{
    const MAX_ARTICLE_SUMMARY_LENGTH = 250;
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * @var string
     */
    private $summary;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="SoftUniBlogBundle\Entity\User", inversedBy="id")
     * @ORM\JoinColumn(referencedColumnName="id")
     */
    private $author;

    /**
     * @var integer
     * @ORM\Column(name="author_id", type="integer")
     */
    private $authorId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="creationDate", type="datetime")
     */
    private $creationDate;

    /**
     * @var string
     *
     * @ORM\Column(name="category", type="string")
     */
    private $category;


    public function __construct()
    {
        $this->creationDate = new \DateTime('now');
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Article
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Article
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set creationDate
     *
     * @param \DateTime $creationDate
     *
     * @return Article
     */
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * Get creationDate
     *
     * @return \DateTime
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * @return mixed
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * @param mixed $author
     */
    public function setAuthor($author)
    {
        $this->author = $author;
    }

    /**
     * @param $authorCandidate User
     * @return bool
     */
    public function isAuthor($authorCandidate)
    {
        return $this->author->getId() === $authorCandidate->getId();
    }

    /**
     * @return mixed
     */
    public function getAuthorId()
    {
        return $this->authorId;
    }

    /**
     * @param mixed $authorId
     */
    public function setAuthorId($authorId)
    {
        $this->authorId = $authorId;
    }

    /**
     * @return string
     */
    public function getSummary(): string
    {
        if ($this->summary === null)
        {
            $this->setSummary('');
        }

        return $this->summary;
    }

    /**
     * @param string $summary
     */
    public function setSummary(string $summary)
    {
        $article_content = $this->getContent();
        // get the first 250 characters for a summary
        $this->summary = substr($this->getContent(), 0, self::MAX_ARTICLE_SUMMARY_LENGTH);
        // attach dots to the end only if the given summary is max length (the original content is more)
        if (strlen($this->summary) == self::MAX_ARTICLE_SUMMARY_LENGTH)
        {
            $this->summary .= "...";
        }
    }

    /**
     * @return string
     */
    public function getCategory(): string
    {
        if ($this->category === null) {
            $this->setCategory('temporary category which will be substituted once the form is submitted, because the category option is required.');
        }

        return $this->category;
    }

    /**
     * @param string $category
     */
    public function setCategory(string $category)
    {
        $this->category = $category;
    }


}


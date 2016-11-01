<?php

namespace SoftUniBlogBundle\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use SoftUniBlogBundle\Entity\Article;
use SoftUniBlogBundle\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HomeController extends Controller
{
    /**
     * @Route("/", name="blog_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $articleRepository
            = $this->getDoctrine()->getRepository(
                Article::class
        );
        // get the articles from the DB
        /**
         * @var $articles Article[]
         */
        $articles = $articleRepository->findAll();
        return $this->render('blog/index.html.twig',[
            "articles" => $articles
        ]);
    }

    /**
     * @Route("/articles/{category}")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexArticlesByCategoryAction($category)
    {
        if (!in_array($category, $this->getParameter('SoftUniBlogBundle.available_article_categories')))
        {
            return $this->render('blog/index.html.twig', ["error" => true,"error_message" => "No category named " . $category . " exists!"]);
        }
        $articleRepository
            = $this->getDoctrine()->getRepository(
            Article::class
        );
        // get the articles from the DB
        /**
         * @var $articles Article[]
         */
        $articles = $articleRepository->findBy(array("category" => $category));
        return $this->render('blog/index.html.twig',[
            "articles" => $articles
        ]);
    }
}

<?php

namespace SoftUniBlogBundle\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use SoftUniBlogBundle\Entity\Article;
use SoftUniBlogBundle\Entity\Category;
use SoftUniBlogBundle\Entity\Tag;
use SoftUniBlogBundle\Form\CategoryType;
use SoftUniBlogBundle\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends Controller
{
    /**
     * @Route("/", name="blog_index")
     * @var $request Request
     * @Method("GET")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        $sortCriteria = $this->getSortCriteria();
        $articles = $this->getArticles($sortCriteria, false);

        return $this->render('blog/index.html.twig',[
            "articles" => $articles,
            "selectedSort" => $sortCriteria,
            "categories" => $this->getDoctrine()->getRepository(Category::class)->findAll()
        ]);
    }

    /**
     * @Route("/articles/tag/{tag}", name="articles_with_tag")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexArticlesByTagAction($tag)
    {
        $sortCriteria = $this->getSortCriteria();
        $articles = $this->getArticlesByTag($sortCriteria, $tag);

        return $this->render('blog/index.html.twig',[
            "articles" => $articles,
            "selectedSort" => $sortCriteria,
            "categories" => $this->getDoctrine()->getRepository(Category::class)->findAll()
        ]);
    }

    /**
     * @Route("/articles/{category}", name="articles_in_category")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexArticlesByCategoryAction($category)
    {
        // check if the given category is valid
        $categories = $this->getDoctrine()->getRepository(Category::class)->findAll();
        $categoriesArray = array_map(function(Category $c){return $c->getName();}, $categories);
        if (!in_array($category, $categoriesArray))
        {
            return $this->render('blog/index.html.twig', [
                "error" => true,
                "error_message" => "No category named " . $category . " exists!"
            ]);
        }

        $sortCriteria = $this->getSortCriteria();
        $articles = $this->getArticles($sortCriteria, $category);

        return $this->render('blog/index.html.twig',[
            "articles" => $articles,
            "selectedSort" => $sortCriteria,
            "categories" => $this->getDoctrine()->getRepository(Category::class)->findAll()

        ]);
    }

    private function getSortCriteria()
    {
        /*
        get the sortCriteria from the query string
        ex: site.com/?sort_by=newest
        will return newest.
        if no query string, we simply return an empty string
        */

        // get the sort by criteria from the querystring
        if (isset($_GET['sort_by']))
        {
            $sortCriteria = $_GET['sort_by'];
        }
        else
        {
            $sortCriteria = '';
        }

        return $sortCriteria;
    }

    private function getArticles($sortCriteria, $category)
    {
        $articleRepository
            = $this->getDoctrine()->getRepository(
            Article::class
        );
        # convert the category to an object
        if ($category) {
            $articles = $this->getDoctrine()->getRepository(Category::class)->findOneBy(array('name'=>$category))->getArticles();
        }
        else {
            $articles = $this->getDoctrine()->getRepository(Article::class)->findAll();
        }
        /* this returns an array of the articles according to the given criteria */
        if ($sortCriteria && $sortCriteria === 'newest')
        {
            // sort by date ascending
            // get the articles from the DB and revese them to have the newest appear first
            /**
             * @var $articles Article[]
             */
            if ($category)
            {
                $articles = array_reverse($articles);
            }
            else
            {
                $articles = array_reverse($articleRepository->findAll());
            }
        }
        else  // no sortCriteria or it's equal to oldest
        {
            // sorts by the oldest articles first
            if ($category)
            {
            }
            else
            {
                $articles = $articleRepository->findAll();
            }
        }

        return $articles;
    }
    private function getArticlesByTag($sortCriteria, $tag)
    {
        $articleRepository
            = $this->getDoctrine()->getRepository(
            Article::class
        );
        # convert the category to an object
        if ($tag) {
            $articles = $this->getDoctrine()->getRepository(Tag::class)->findOneBy(array('name'=>$tag))->getTags();
        }
        else {
            $articles = $this->getDoctrine()->getRepository(Article::class)->findAll();
        }
        /* this returns an array of the articles according to the given criteria */
        if ($sortCriteria && $sortCriteria === 'newest')
        {
            // sort by date ascending
            // get the articles from the DB and revese them to have the newest appear first
            /**
             * @var $articles Article[]
             */
            if ($tag)
            {
                $articles = array_reverse($articles);
            }
            else
            {
                $articles = array_reverse($articleRepository->findAll());
            }
        }
        else  // no sortCriteria or it's equal to oldest
        {
            // sorts by the oldest articles first
            if ($tag)
            {
            }
            else
            {
                $articles = $articleRepository->findAll();
            }
        }

        return $articles;
    }
}

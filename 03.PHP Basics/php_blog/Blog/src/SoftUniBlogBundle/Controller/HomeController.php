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
use Symfony\Component\HttpFoundation\Request;

class HomeController extends Controller
{
    /**
     * @Route("/", name="blog_index")
     * @var $request Request
     * @Method("GET")
     */
    public function indexAction(Request $request)
    {
        // $_GET parameters
        if (isset($_GET['sort_by']))
        {
            $sortCriteria = $_GET['sort_by'];
        }
        else
        {
            $sortCriteria = '';
        }
        $articleRepository
            = $this->getDoctrine()->getRepository(
            Article::class
        );

        if ($sortCriteria && $sortCriteria !== 'oldest')
        {
            if ($sortCriteria === 'newest')
            {
                // sort by date ascending
                // get the articles from the DB and revese them to have the newest appear first
                /**
                 * @var $articles Article[]
                 */
                $articles = array_reverse($articleRepository->findAll());

            }
            else
            {
                // default sorting by oldest
                $articles = $articleRepository->findAll();
            }
        }
        else  // no sortCriteria or it's equal to oldest
        {
            // sorts by the oldest articles first
            $articles = $articleRepository->findAll();
        }


        return $this->render('blog/index.html.twig',[
            "articles" => $articles,
            "selectedSort" => $sortCriteria,
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

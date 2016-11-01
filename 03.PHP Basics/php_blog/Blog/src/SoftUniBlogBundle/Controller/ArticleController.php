<?php

namespace SoftUniBlogBundle\Controller;

use Doctrine\ORM\Mapping\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use SoftUniBlogBundle\Entity\Article;
use SoftUniBlogBundle\Form\ArticleType;
use SoftUniBlogBundle\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints\DateTime;

class ArticleController extends Controller
{
//    /**
//     * @Route("/create_article", name="create_article")
//     * @Method("GET")
//     */
//    public function showCreateArticlePage()
//    {
//        return $this->render('article/create.html.twig');
//    }

    /**
     * @Route("/create_article", name="create_article")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function createArticleAction(Request $request)
    {
        // 1) build the form
        $article = new Article();
        $form= $this->createForm(ArticleType::class, $article);

        // 2) handle the submit request (POST)
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid())
        {
            // 3) save the article
            $article->setCreationDate(new \DateTime());
            $author = $this->getUser();
            $article->setAuthor($author);
            $em = $this->getDoctrine()->getManager();
            $em->persist($article);
            $em->flush();

            return $this->redirectToRoute('blog_index');
        }

        return $this->render(
            'article/create.html.twig',
            array('form' => $form->createView())
        );
    }

    /**
     * @Route("/article/{id}", name="article_show")
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function showAction($id)
    {
        $articleRepo = $this->getDoctrine()->getRepository(
            Article::class
        );
        // get the article from the DB
        /**
         * @var $article Article
         */
        $article = $articleRepo->find($id);

        return $this->render('article/show.html.twig',[
            "article" => $article
        ]);
    }
}
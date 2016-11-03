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

        $available_article_categories = $this->getParameter('SoftUniBlogBundle.available_article_categories');
        return $this->render(
            'article/create.html.twig',
            array('form' => $form->createView(),"select_options" => $available_article_categories)
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


        if ($article === null)
        {
            return $this->render('article/show.html.twig', [
                "error" => true
            ]);
        }
        return $this->render('article/show.html.twig',[
            "article" => $article,
        ]);
    }

    /**
     * @Route("/article/{id}/edit", name="article_edit")
     * @param Request $request
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editArticle(Request $request, $id)
    {
        $articleRepo =$this->getDoctrine()->getRepository(
            Article::class
        );
        // get the article from the db
        $originalArticle = $articleRepo->find($id);  /** @var $originalArticle Article */
        $wannaBeArticle = clone $originalArticle; /** @var $wannaBeArticle Article */

        if ($originalArticle === null)
        {
            return $this->render('article/show.html.twig', [
                "error" => true
            ]);
        }

        // paste the form to the wannaBeArticle
        $form= $this->createForm(ArticleType::class, $wannaBeArticle);
        // 2) handle the submit request (POST)
        $form->handleRequest($request);


        $available_article_categories = $this->getParameter('SoftUniBlogBundle.available_article_categories');

        if ($form->isSubmitted() && $form->isValid())
        {
            // save the article

            // only editing the content is allowed
            $originalArticle->setContent($wannaBeArticle->getContent());

            $em = $this->getDoctrine()->getManager();
            $em->persist($originalArticle);
            $em->flush();

            return $this->redirectToRoute('article_show', array('id' => $originalArticle->getId()));
        }

        return $this->render('article/edit.html.twig',
            ["form" => $form->createView(), "article" => $originalArticle, "select_options" => $available_article_categories]);
    }


}
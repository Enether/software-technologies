<?php

namespace SoftUniBlogBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use SoftUniBlogBundle\Entity\Article;
use SoftUniBlogBundle\Entity\Category;
use SoftUniBlogBundle\Form\ArticleType;
use SoftUniBlogBundle\Form\CategoryType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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

        return $this->render(
            'article/create.html.twig',
            array('form' => $form->createView(),"categories" => $this->getDoctrine()->getRepository(Category::class)->findAll())
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
                "error" => true,
                "error_message" => $this->getParameter('SoftUniBlogBundle.invalid_article_message')
            ]);
        }
        return $this->render('article/show.html.twig',[
            "article" => $article,
            "categories" => $this->getDoctrine()->getRepository(Category::class)->findAll()
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

        if ($originalArticle === null)
        {
            return $this->render('article/show.html.twig', [
                "error" => true,
                "error_message" => $this->getParameter('SoftUniBlogBundle.invalid_article_message')
            ]);
        }
        else if (!$this->getUser()->isAdmin() && !$originalArticle->isAuthor($this->getUser()))  // if he's not an admin and not the author
        {
            return $this->render('article/show.html.twig', [
                "error" => true,
                "error_message" => $this->getParameter('SoftUniBlogBundle.invalid_edit_permission_message')
            ]);
        }

        $candidateArticle = clone $originalArticle; /** @var $candidateArticle Article */
        // paste the form to the candidateArticle
        $form= $this->createForm(ArticleType::class, $candidateArticle);
        // 2) handle the submit request (POST)
        $form->handleRequest($request);


        if ($form->isSubmitted() && $form->isValid())
        {
            // save the article

            // only editing the content is allowed
            $originalArticle->setContent($candidateArticle->getContent());

            $em = $this->getDoctrine()->getManager();
            $em->persist($originalArticle);
            $em->flush();

            return $this->redirectToRoute('article_show', array('id' => $originalArticle->getId()));
        }

        return $this->render('article/edit.html.twig', [
            "form" => $form->createView(),
            "article" => $originalArticle,
            "categories" => $this->getDoctrine()->getRepository(Category::class)->findAll()
        ]);
    }

    /**
     * @Route("/article/{id}/delete", name="article_delete")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function deleteArticle($id)
    {
        $article = $this->getDoctrine()->getRepository(Article::class)->find($id);

        if ($article === null)
        {
            return $this->render('article/show.html.twig', [
                "error" => true,
                "error_message" => $this->getParameter('SoftUniBlogBundle.invalid_article_message')
            ]);
        }
        else if (!$this->getUser()->isAdmin() && !$article->isAuthor($this->getUser()))  // if he's not an admin and not the author
        {
            return $this->render('article/show.html.twig', [
                "error" => true,
                "error_message" => $this->getParameter('SoftUniBlogBundle.invalid_delete_permission_message')
            ]);
        }

        // delete the article from the DB
        $em = $this->getDoctrine()->getManager();
        $em->remove($article);
        $em->flush();

        return $this->redirectToRoute('blog_index');
    }

}
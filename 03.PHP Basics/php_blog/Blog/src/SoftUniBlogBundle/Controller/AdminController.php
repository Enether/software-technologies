<?php

namespace SoftUniBlogBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use SoftUniBlogBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdminController extends Controller
{
    /**
     * @Route("/admin/users_list", name="list_users")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function listUsersAction()
    {
        if ($this->getUser() === null or !$this->getUser()->isAdmin())
        {
            return $this->redirectToRoute('blog_index');
        }

        // get the users
        /**
         * @var $users User[]
         */
        $users = $this->getDoctrine()->getRepository(User::class)->findAll();
        return $this->render('admin/users_list.html.twig', ['users'=> $users]);
    }
    public function indexAction($name)
    {
        return $this->render('', array('name' => $name));
    }
}

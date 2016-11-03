<?php

namespace SoftUniBlogBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use SoftUniBlogBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdminController extends Controller
{
    /**
     * @Route("/admin/users_list", name="list_users")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function listUsersAction()
    {
        if (!$this->getUser()->isAdmin())
        {
            return $this->redirectToRoute('blog_index');  /* no message, we don't want the user to know
                                                            such a thing exists at all*/
        }

        // get the users
        /** @var $users User[] */
        $users = $this->getDoctrine()->getRepository(User::class)->findAll();
        return $this->render('admin/users_list.html.twig', ['users'=> $users]);
    }

    /**
     * @Route("/admin/delete_user/{id}", name="user_delete")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function deleteUserAction($id)
    {
        // ...you heartless bastard...
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        if (!$this->getUser()->isAdmin())
        {
            return $this->redirectToRoute('blog_index', [
                'error' => true,
                'error_message' => $this->getParameter('SoftUniBlogBundle.invalid_user_delete_message')
            ]);
        }
        else if (!$user)
        {
            return $this->redirectToRoute('blog_index', [
                'error' => true,
                'error_message' => $this->getParameter('SoftUniBlogBundle.invalid_user_message')
            ]);
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($user);
        $em->flush();

        return $this->render('admin/users_list.html.twig', [
            'message' => true,
            'success_message' => 'Successfully deleted user '.$user->getUsername()]);
    }
    public function indexAction($name)
    {
        return $this->render('', array('name' => $name));
    }
}

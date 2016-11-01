<?php
// src/AppBundle/Twig/AppExtension.php
namespace SoftUniBlogBundle\Twig;

class AppExtension extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('capitalize', array($this, 'capitalizeString')),
        );
    }
    public function capitalizeString($str)
    {
        return ucfirst($str);
    }
}
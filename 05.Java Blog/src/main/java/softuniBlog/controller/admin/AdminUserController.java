package softuniBlog.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import softuniBlog.entity.User;
import softuniBlog.repository.ArticleRepository;
import softuniBlog.repository.RoleRepository;
import softuniBlog.repository.UserRepository;

import java.util.List;

/**
 * Created by Netherblood on 11/24/2016.
 */
@Controller
@RequestMapping(path = "/admin/users")
public class AdminUserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ArticleRepository articleRepository;

    @GetMapping("/")
    public String listUsers(Model model) {
        List<User> users = this.userRepository.findAll();

        model.addAttribute("users", users);
        model.addAttribute("view", "admin/user/list");

        return "base-layout";
    }
}

package softuniBlog.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import softuniBlog.bindingModel.UserEditBindingModel;
import softuniBlog.entity.Article;
import softuniBlog.entity.Role;
import softuniBlog.entity.User;
import softuniBlog.repository.ArticleRepository;
import softuniBlog.repository.RoleRepository;
import softuniBlog.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @GetMapping("/edit/{id}")
    public String editUser(@PathVariable Integer id, Model model) {
        if (!this.userRepository.exists(id)) {
            return "redirect:/admin/users/";  // NO SUCH USER
        }

        User user = this.userRepository.findOne(id);
        List<Role> roles = this.roleRepository.findAll();

        model.addAttribute("user", user);
        model.addAttribute("roles", roles);
        model.addAttribute("view", "admin/user/edit");

        return "base-layout";
    }

    @PostMapping("/edit/{id}")
    public String editUserProcess(@PathVariable Integer id, UserEditBindingModel userBindingModel) {
        if (!this.userRepository.exists(id)) {
            return "redirect:/admin/users/";
        }

        User user = this.userRepository.findOne(id);

        // if the user wants to change his password and they match, change it
        if (!StringUtils.isEmpty(userBindingModel.getPassword()) && !StringUtils.isEmpty(userBindingModel.getConfirmPassword())) {
            if(userBindingModel.getPassword().equals(userBindingModel.getConfirmPassword())) {
                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

                user.setPassword(bCryptPasswordEncoder.encode(userBindingModel.getPassword()));
            }
        }

        user.setFullName(userBindingModel.getFullName());
        user.setEmail(userBindingModel.getEmail());

        // iterate over the roles
        Set<Role> roles = new HashSet<Role>();
        for (Integer roleId : userBindingModel.getRoles()) {
            roles.add(this.roleRepository.findOne(roleId));
        }

        user.setRoles(roles);
        // save the user
        this.userRepository.saveAndFlush(user);

        return "redirect:/admin/users/";
    }

    @GetMapping("/delete/{id")
    public String delete(@PathVariable Integer id, Model model) {
        if (!this.userRepository.exists(id)) {
            return "redirect:/admin/users/";
        }

        User user = this.userRepository.findOne(id);

        model.addAttribute("user", user);
        model.addAttribute("view", "admin/user/delete");

        return "base-layout";
    }

    @PostMapping("/delete/{id}")
    public String deleteProcess(@PathVariable Integer id) {
        if (!this.userRepository.exists(id)) {
            return "redirect:/admin/users/";
        }

        User user = this.userRepository.findOne(id);
        // delete the user's articles
        for (Article article : user.getArticles()) {
            this.articleRepository.delete(article);
        }

        this.userRepository.delete(user);

        return "redirect:/admin/users/";
    }
}

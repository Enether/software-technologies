package softuniBlog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Netherblood on 11/22/2016.
 */
@Controller
public class HomeController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("view", "home/index");
        return "base-layout";
    }

}

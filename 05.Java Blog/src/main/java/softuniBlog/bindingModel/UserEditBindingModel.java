package softuniBlog.bindingModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Netherblood on 11/24/2016.
 */
public class UserEditBindingModel extends UserBindingModel {
    private List<Integer> roles;

    public UserEditBindingModel() {
        this.roles = new ArrayList<>();
    }

    public List<Integer> getRoles() {
        return this.roles;
    }

    public void setRoles(List<Integer> roles) {
        this.roles = roles;
    }
}

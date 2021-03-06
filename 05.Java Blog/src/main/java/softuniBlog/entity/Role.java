package softuniBlog.entity;

import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Netherblood on 11/22/2016.
 */
@Entity
@Table(name="roles")
public class Role {
    private Set<User> users;

    private Integer id;
    @ManyToMany(mappedBy = "roles")
    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    private String name;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    @Column(name = "name", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role() {
        this.users = new HashSet<>();
    }

    @Transient
    public String getSimpleName() {
        // ROLE_USER => ROLE_User :)
        return StringUtils.capitalize(this.getName().substring(5).toLowerCase());
    }
}

package softuniBlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import softuniBlog.entity.User;
/**
 * Created by Netherblood on 11/22/2016.
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}

package softuniBlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import softuniBlog.entity.Article;

/**
 * Created by Netherblood on 11/22/2016.
 */
public interface ArticleRepository extends JpaRepository<Article, Integer> {

}

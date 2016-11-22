package softuniBlog.bindingModel;

import javax.validation.constraints.NotNull;

/**
 * Created by Netherblood on 11/22/2016.
 */
public class ArticleBindingModel {
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @NotNull
    private String title;

    @NotNull
    private String content;
}

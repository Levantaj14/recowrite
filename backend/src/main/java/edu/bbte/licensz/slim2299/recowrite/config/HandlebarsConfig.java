package edu.bbte.licensz.slim2299.recowrite.config;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.io.ClassPathTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HandlebarsConfig {

    @Bean
    public Handlebars handlebars() {
        TemplateLoader templateLoader = new ClassPathTemplateLoader("/templates", ".hbs");
        return new Handlebars(templateLoader);
    }
}

package edu.bbte.licensz.slim2299.recowrite.services;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Year;
import java.util.Map;

@Slf4j
@Component
public class MailService implements MailServiceInterface {
    private final JavaMailSender emailSender;
    private final Handlebars handlebars;

    @Autowired
    public MailService(JavaMailSender emailSender, Handlebars handlebars) {
        this.emailSender = emailSender;
        this.handlebars = handlebars;
    }

    @Async
    @Override
    public void sendMessage(String to, String subject, String file, Map<String, String> data, Map<String, String> images) {
        if (data == null) {
            log.error("data is null!");
            return;
        }
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");

            helper.setFrom(System.getenv("EMAIL"));
            helper.setTo(to);
            helper.setSubject(subject);

            Template template = handlebars.compile(file);
            data.put("year", Year.now().toString());
            helper.setText(template.apply(data), true);

            if (images != null) {
                for (Map.Entry<String, String> entry : images.entrySet()) {
                    attachImage(helper, entry.getValue(), entry.getKey());
                }
            }

            emailSender.send(message);
        } catch (MessagingException e) {
            log.error("There was a problem sending the message", e);
        } catch (IOException e) {
            log.error("There was a problem finding the message template", e);
        }
    }

    private void attachImage(MimeMessageHelper helper, String imageName, String contentId) throws MessagingException {
        ClassPathResource image = new ClassPathResource("pictures/" + imageName);
        helper.addInline(contentId, image);
    }

}

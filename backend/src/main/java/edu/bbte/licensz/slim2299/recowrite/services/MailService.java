package edu.bbte.licensz.slim2299.recowrite.services;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
public class MailService implements MailServiceInterface {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private Handlebars handlebars;

    @Override
    public void sendMessage(String to, String subject, String file, Map<String, String> data) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(System.getenv("EMAIL"));
            helper.setTo(to);
            helper.setSubject(subject);

            Template template = handlebars.compile(file);
            helper.setText(template.apply(data), true);

            emailSender.send(message);
        } catch (MessagingException e) {
            log.error("There was a problem sending the message", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

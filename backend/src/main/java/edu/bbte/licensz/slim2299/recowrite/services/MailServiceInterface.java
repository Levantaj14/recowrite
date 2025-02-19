package edu.bbte.licensz.slim2299.recowrite.services;

import java.util.Map;

public interface MailServiceInterface {
    void sendMessage(String to, String subject, String file, Map<String, String> data, Map<String, String> images);
}

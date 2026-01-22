package edu.bbte.licensz.slim2299.recowrite.services.scheduled;

import edu.bbte.licensz.slim2299.recowrite.services.TokenServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ScheduledTokenRemovalService {
    private final TokenServiceInterface tokenService;

    @Autowired
    public ScheduledTokenRemovalService(TokenServiceInterface tokenService) {
        this.tokenService = tokenService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("Starting token removal service");
        tokenService.deleteExpiredTokens();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void invokeDaily() {
        log.info("Invoking daily token removal service");
        tokenService.deleteExpiredTokens();
    }
}

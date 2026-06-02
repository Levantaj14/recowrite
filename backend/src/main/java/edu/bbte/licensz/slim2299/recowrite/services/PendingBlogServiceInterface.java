package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.PendingDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;

import java.util.List;

public interface PendingBlogServiceInterface {
    List<PendingBlogDtoOut> getPendingBlogs();

    PendingDtoOut getPendingBlogById(long id);

    void changeStatus(Long blogId, ApproveStatus status, String reviewer);
}

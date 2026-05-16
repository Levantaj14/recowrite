package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;

import java.util.List;

public interface PendingBlogServiceInterface {
    List<PendingBlogDtoOut> getPendingBlogs();

    void changeStatus(Long blogId, ApproveStatus status, String reviewer);
}

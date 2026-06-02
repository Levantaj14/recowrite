package edu.bbte.licensz.slim2299.recowrite.dao.models;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "pending_blogs")
public class PendingBlog extends BaseEntity {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private BlogModel blog;

    private String reason;

    private ApproveStatus approveStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserModel reviewedBy;
}

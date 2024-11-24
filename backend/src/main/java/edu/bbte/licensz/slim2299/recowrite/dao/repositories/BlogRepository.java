package edu.bbte.licensz.slim2299.recowrite.dao.repositories;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends MongoRepository<BlogModel, String> {
    @Query("{_id: ?0}")
    Optional<List<BlogModel>> findById(ObjectId id);
}

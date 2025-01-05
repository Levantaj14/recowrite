package edu.bbte.licensz.slim2299.recowrite.dao.managers.blogs;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends MongoRepository<BlogModel, String> {
    @Query("{author: ?0}")
    Optional<List<BlogModel>> findAllByAuthor(ObjectId authorId);
}

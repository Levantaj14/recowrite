package edu.bbte.licensz.slim2299.recowrite.dao.managers.users;

import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
}

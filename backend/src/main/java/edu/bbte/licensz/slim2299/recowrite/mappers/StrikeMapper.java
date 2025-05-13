package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.StrikeDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StrikeMapper {
    private final UserMapper userMapper;
    private final ReportsMapper reportsMapper;

    @Autowired
    public StrikeMapper(UserMapper userMapper, ReportsMapper reportsMapper) {
        this.userMapper = userMapper;
        this.reportsMapper = reportsMapper;
    }

    public StrikeDtoOut modelToDto(StrikeModel strikeModel) {
        StrikeDtoOut strikeDto = new StrikeDtoOut();
        strikeDto.setId(strikeModel.getId());
        strikeDto.setUser(userMapper.modelToDto(strikeModel.getUser()));
        strikeDto.setAdmin(userMapper.modelToDto(strikeModel.getAdmin()));
        strikeDto.setReport(reportsMapper.modelToDto(strikeModel.getReport()));
        strikeDto.setEvaluated(strikeModel.getEvaluated());
        return strikeDto;
    }
}

package com.spring.classon.oneday.mapper;

import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.entity.OneDay;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "instructorName", expression = "java(instructorNameMap.get(oneDay.getMemNo()))")
    @Mapping(target = "rating", expression = "java(ratingMap.get(oneDay.getClsNo()))")
    ProductResponseDTO toDTO(
            OneDay oneDay,
            @Context Map<Long, String> instructorNameMap,
            @Context Map<Long, Double> ratingMap
    );

    List<ProductResponseDTO> toDTOList(
            List<OneDay> oneDays,
            @Context Map<Long, String> instructorNameMap,
            @Context Map<Long, Double> ratingMap
    );
}

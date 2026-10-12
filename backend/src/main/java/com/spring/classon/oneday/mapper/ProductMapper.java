package com.spring.classon.oneday.mapper;

import com.spring.classon.oneday.dto.ProductRequestDTO;
import com.spring.classon.oneday.dto.ProductResponseDTO;
import com.spring.classon.oneday.entity.OneDay;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    record NameLookup(Map<Long, String> catNameMap, Map<Long, String> instructorNameMap) {
    }

    @Mapping(target = "catName", expression = "java(names.catNameMap().get(oneDay.getCatNo()))")
    @Mapping(target = "instructorName", expression = "java(names.instructorNameMap().get(oneDay.getMemNo()))")
    @Mapping(target = "rating", expression = "java(ratingMap.get(oneDay.getClsNo()))")
    ProductResponseDTO toDTO(
            OneDay oneDay,
            @Context NameLookup names,
            @Context Map<Long, Double> ratingMap
    );

    List<ProductResponseDTO> toDTOList(
            List<OneDay> oneDays,
            @Context NameLookup names,
            @Context Map<Long, Double> ratingMap
    );

    @Mapping(target = "memNo", source = "memNo")
    @Mapping(target = "clsImgOrigin", source = "clsImgOrigin")
    @Mapping(target = "clsImgThumb", source = "clsImgThumb")
    @Mapping(target = "clsStatus", expression = "java(com.spring.classon.oneday.status.OneDayStatus.READY)")
    OneDay toEntity(ProductRequestDTO dto, Long memNo, String clsImgOrigin, String clsImgThumb);
}

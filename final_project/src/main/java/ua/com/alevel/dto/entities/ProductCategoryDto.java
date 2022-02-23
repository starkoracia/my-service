package ua.com.alevel.dto.entities;

import lombok.Data;
import ua.com.alevel.entities.ProductCategory;

import java.io.Serializable;
import java.util.List;

@Data
public class ProductCategoryDto extends BaseDto<ProductCategory> {
    private Long id;
    private String name;

    public ProductCategory toProductCategory() {
        ProductCategory category = new ProductCategory();
        category.setId(this.id);
        category.setName(this.name);
        return category;
    }

    public static ProductCategoryDto toDto(ProductCategory category) {
        if(category == null) {
            return null;
        }
        ProductCategoryDto dto = new ProductCategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }

    public static List<ProductCategoryDto> toDtoList(List<ProductCategory> categories) {
        return categories.stream().map(ProductCategoryDto::toDto).toList();
    }

}

package ua.com.alevel.dto.entities;

import lombok.Data;
import ua.com.alevel.entities.RelocatableProduct;

import java.io.Serializable;
import java.util.List;

@Data
public class RelocatableProductDto extends BaseDto<RelocatableProduct> {
    private Long id;
    private ProductMaterialDto productMaterial;
    private Integer numberOf;

    public RelocatableProduct toRelocatableProduct() {
        RelocatableProduct relocatable = new RelocatableProduct();
        relocatable.setId(this.id);
        relocatable.setProductMaterial(this.productMaterial != null ? this.productMaterial.toProductMaterial() : null);
        relocatable.setNumberOf(this.numberOf);
        return relocatable;
    }

    public static RelocatableProductDto toDto(RelocatableProduct relocatable) {
        if(relocatable == null) {
            return null;
        }
        RelocatableProductDto dto = new RelocatableProductDto();
        dto.setId(relocatable.getId());
        dto.setProductMaterial(ProductMaterialDto.toDto(relocatable.getProductMaterial()));
        dto.setNumberOf(relocatable.getNumberOf());
        return dto;
    }

    public static List<RelocatableProductDto> toDtoList(List<RelocatableProduct> relocatableProducts) {
        return relocatableProducts.stream().map(RelocatableProductDto::toDto).toList();
    }

}

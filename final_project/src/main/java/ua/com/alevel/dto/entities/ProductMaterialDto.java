package ua.com.alevel.dto.entities;

import lombok.Data;
import ua.com.alevel.entities.ProductMaterial;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductMaterialDto extends BaseDto<ProductMaterial> {
    private Long id;
    private ProductCategoryDto productCategory;
    private String name;
    private String description;
    private String code;
    private String vendorCode;
    private Boolean isWarranty;
    private Integer warrantyDays;
    private BigDecimal zeroCost;
    private BigDecimal repairCost;
    private BigDecimal tradeCost;
    private Integer numberOf;
    private Boolean inStock;

    public ProductMaterial toProductMaterial() {
        ProductMaterial product = new ProductMaterial();
        product.setId(this.id);
        product.setProductCategory(this.productCategory != null ? this.productCategory.toProductCategory() : null);
        product.setName(this.name);
        product.setDescription(this.description);
        product.setCode(this.code);
        product.setVendorCode(this.vendorCode);
        product.setIsWarranty(this.isWarranty);
        product.setWarrantyDays(this.warrantyDays);
        product.setZeroCost(this.zeroCost);
        product.setRepairCost(this.repairCost);
        product.setTradeCost(this.tradeCost);
        product.setNumberOf(this.numberOf);
        product.setInStock(this.inStock);
        return product;
    }

    public static ProductMaterialDto toDto(ProductMaterial product) {
        if (product == null) {
            return null;
        }
        ProductMaterialDto dto = new ProductMaterialDto();
        dto.setId(product.getId());
        dto.setProductCategory(ProductCategoryDto.toDto(product.getProductCategory()));
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCode(product.getCode());
        dto.setVendorCode(product.getVendorCode());
        dto.setIsWarranty(product.getIsWarranty());
        dto.setWarrantyDays(product.getWarrantyDays());
        dto.setZeroCost(product.getZeroCost());
        dto.setRepairCost(product.getRepairCost());
        dto.setTradeCost(product.getTradeCost());
        dto.setNumberOf(product.getNumberOf());
        dto.setInStock(product.getInStock());
        return dto;
    }

    public static List<ProductMaterialDto> toDtoList(List<ProductMaterial> products) {
        return products.stream().map(ProductMaterialDto::toDto).toList();
    }

}

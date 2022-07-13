package ua.com.alevel.dto.entities;

import lombok.Data;
import ua.com.alevel.entities.WarehousePosting;

import java.util.Calendar;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class WarehousePostingDto extends BaseDto<WarehousePosting> {
    private Long id;
    private Set<RelocatableProductDto> relocatableProducts = new LinkedHashSet<>();
    private ClientDto supplier;
    private String description;
    private EmployeeDto employee;
    private Calendar dateTime;
    private PaymentDto payment;

    public WarehousePosting toPosting() {
        WarehousePosting posting = new WarehousePosting();
        posting.setId(this.id);
        posting.setRelocatableProducts(this.relocatableProducts.stream()
                .map(RelocatableProductDto::toRelocatableProduct)
                .collect(Collectors.toSet()));
        posting.setSupplier(this.supplier != null ? this.supplier.toClient() : null);
        posting.setDescription(this.description);
        posting.setEmployee(this.employee != null ? this.employee.toEmployee() : null);
        posting.setDateTime(this.dateTime);
        posting.setPayment(this.payment != null ? this.payment.toPayment() : null);
        return posting;
    }

    public static WarehousePostingDto toDto(WarehousePosting posting) {
        if (posting == null) {
            return null;
        }
        WarehousePostingDto dto = new WarehousePostingDto();
        dto.setId(posting.getId());
        dto.setSupplier(ClientDto.toDto(posting.getSupplier()));
        dto.setDescription(posting.getDescription());
        dto.setEmployee(EmployeeDto.toDto(posting.getEmployee()));
        dto.setDateTime(posting.getDateTime());
        dto.setPayment(PaymentDto.toDto(posting.getPayment()));
        return dto;
    }

    public static List<WarehousePostingDto> toDtoList(List<WarehousePosting> postings) {
        return postings.stream().map(WarehousePostingDto::toDto).toList();
    }

}

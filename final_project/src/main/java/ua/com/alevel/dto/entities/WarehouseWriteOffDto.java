package ua.com.alevel.dto.entities;

import lombok.Data;
import ua.com.alevel.entities.WarehouseWriteOff;

import java.util.Calendar;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class WarehouseWriteOffDto extends BaseDto<WarehouseWriteOff> {
    private Long id;
    private ClientDto client;
    private Set<RelocatableProductDto> relocatableProducts = new LinkedHashSet<>();
    private String description;
    private EmployeeDto employee;
    private Calendar dateTime;
    private OrderDto order;
    private PaymentDto payment;

    public WarehouseWriteOff toWriteOff() {
        WarehouseWriteOff writeOff = new WarehouseWriteOff();
        writeOff.setId(this.id);
        writeOff.setClient(this.client != null ? this.client.toClient() : null);
        writeOff.setRelocatableProducts(this.relocatableProducts.stream()
                .map(RelocatableProductDto::toRelocatableProduct)
                .collect(Collectors.toSet()));
        writeOff.setDescription(this.description);
        writeOff.setEmployee(this.employee != null ? this.employee.toEmployee() : null);
        writeOff.setDateTime(this.dateTime);
        writeOff.setOrder(this.order != null ? this.order.toOrder() : null);
        writeOff.setPayment(this.payment != null ? this.payment.toPayment() : null);
        return writeOff;
    }

    public static WarehouseWriteOffDto toDto(WarehouseWriteOff writeOff) {
        if (writeOff == null) {
            return null;
        }
        WarehouseWriteOffDto dto = new WarehouseWriteOffDto();
        dto.setId(writeOff.getId());
        dto.setClient(ClientDto.toDto(writeOff.getClient()));
        dto.setDescription(writeOff.getDescription());
        dto.setEmployee(EmployeeDto.toDto(writeOff.getEmployee()));
        dto.setDateTime(writeOff.getDateTime());
        dto.setOrder(OrderDto.toDto(writeOff.getOrder()));
        dto.setPayment(PaymentDto.toDto(writeOff.getPayment()));
        return dto;
    }

    public static List<WarehouseWriteOffDto> toDtoList(List<WarehouseWriteOff> writeOffs) {
        return writeOffs.stream().map(WarehouseWriteOffDto::toDto).toList();
    }

}

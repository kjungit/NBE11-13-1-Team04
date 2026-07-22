package com.springbeans.cafemenumanagement.admin.sales.service;

import com.springbeans.cafemenumanagement.admin.sales.dto.SalesStatResponse;
import com.springbeans.cafemenumanagement.admin.sales.repository.SalesRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminSalesService {

    private final SalesRepositoryCustom salesRepository;

    public SalesStatResponse getSalesStatistics(Integer year, Integer month) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();

        LocalDate monthStart = YearMonth.of(targetYear, targetMonth).atDay(1);
        LocalDate monthEnd = YearMonth.of(targetYear, targetMonth).atEndOfMonth();

        // 1. 기간별 데이터 조회
        List<SalesStatResponse.PeriodSalesStat> monthlyStats = salesRepository.getMonthlySales(targetYear);
        List<SalesStatResponse.PeriodSalesStat> dailyStats = salesRepository.getDailySales(monthStart, monthEnd);
        List<SalesStatResponse.TopProductStat> topProducts = salesRepository.getTopProducts(monthStart, monthEnd, 5);

        // 2. Summary 카드 지표 계산
        long currentMonthPrice = dailyStats.stream().mapToLong(SalesStatResponse.PeriodSalesStat::totalPrice).sum();
        long currentMonthCount = dailyStats.stream().mapToLong(SalesStatResponse.PeriodSalesStat::totalAmount).sum();

        String todayStr = now.toString();
        SalesStatResponse.PeriodSalesStat todayStat = dailyStats.stream()
                .filter(d -> d.period().equals(todayStr))
                .findFirst()
                .orElse(new SalesStatResponse.PeriodSalesStat(todayStr, 0L, 0L));

        SalesStatResponse.Summary summary = new SalesStatResponse.Summary(
                currentMonthPrice,
                currentMonthCount,
                todayStat.totalPrice(),
                todayStat.totalAmount()
        );

        return new SalesStatResponse(summary, monthlyStats, dailyStats, topProducts);
    }
}
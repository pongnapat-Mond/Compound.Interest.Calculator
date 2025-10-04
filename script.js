
let savingsChart;

/**

 @param {number} PV 
 @param {number} P 
 @param {number} i 
 @param {number} n 
 @param {number} t 
 @returns {number}
 */
function calculateCompoundInterestWithContributions(PV, P, i, n, t) {
    const rate_per_period = i / n;
    const total_periods = n * t;

   
    const fv_from_pv = PV * Math.pow((1 + rate_per_period), total_periods);

  
    const fv_from_p = P * ((Math.pow((1 + rate_per_period), total_periods) - 1) / rate_per_period);
    
ช
    const FV = fv_from_pv + fv_from_p;
    
    return FV;
}

/**

  @param {number} PV 
  @param {number} i 
  @param {number} n 
  @param {number} t 
  @returns {number} 
 */
function calculateCompoundInterestOnlyPV(PV, i, n, t) {
    const rate_per_period = i / n;
    const total_periods = n * t;
    return PV * Math.pow((1 + rate_per_period), total_periods);
}


function calculateAndPlot() {
    const PV = parseFloat(document.getElementById('initial_principal').value) || 0;
    const P = parseFloat(document.getElementById('monthly_contribution').value) || 0;
    const rate_percent = parseFloat(document.getElementById('rate').value) || 0;
    const t = parseInt(document.getElementById('years').value) || 0;
    const n = 12;

    if (t <= 0) {
        alert("กรุณาระบุระยะเวลาเป็นปี");
        return;
    }

    const i = rate_percent / 100;
    const total_contributed_principal = PV + (P * n * t);

    const FV_with_P = calculateCompoundInterestWithContributions(PV, P, i, n, t);
    const total_interest = FV_with_P - total_contributed_principal;
    

    const FV_only_PV = calculateCompoundInterestOnlyPV(PV, i, n, t);


    document.getElementById('final-amount-display').textContent = FV_with_P.toLocaleString('th-TH', { 
        minimumFractionDigits: 2, maximumFractionDigits: 2 
    }) + " บาท";
    
    document.getElementById('total-money').textContent = FV_with_P.toLocaleString('th-TH', { minimumFractionDigits: 2 });
    document.getElementById('total-principal').textContent = total_contributed_principal.toLocaleString('th-TH', { minimumFractionDigits: 2 });
    document.getElementById('total-interest').textContent = total_interest.toLocaleString('th-TH', { minimumFractionDigits: 2 });
 
    document.getElementById('compound-interest-only-pv').textContent = FV_only_PV.toLocaleString('th-TH', { minimumFractionDigits: 2 });

 

    const yearly_labels = [];
    const yearly_principal = [];
    const yearly_interest = [];
    const yearly_total = []; 

    for (let year = 1; year <= t; year++) {
        yearly_labels.push(`ปีที่ ${year}`);
        
        // คำนวณเงินรวม ณ สิ้นปีที่ year
        const fv_at_year = calculateCompoundInterestWithContributions(PV, P, i, n, year);
        
     
        const principal_at_year = PV + (P * n * year);
        
        const interest_at_year = fv_at_year - principal_at_year;

  
        yearly_principal.push(principal_at_year.toFixed(2));
        yearly_interest.push(interest_at_year.toFixed(2));
        yearly_total.push(fv_at_year); // 💥 เก็บยอดรวม
    }

    const ctx = document.getElementById('savingsChart').getContext('2d');
    
 
    if (savingsChart) {
        savingsChart.destroy();
    }

 
    savingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: yearly_labels,
            datasets: [
                {
                    label: 'เงินต้น',
                    data: yearly_principal,
                    backgroundColor: 'rgba(0, 123, 255, 0.8)', // สีน้ำเงิน
                },
                {
                    label: 'ดอกเบี้ย',
                    data: yearly_interest,
                    backgroundColor: 'rgba(255, 159, 64, 0.8)', // สีส้ม
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toLocaleString(); 
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'การเติบโตของเงินออม (เงินต้น vs ดอกเบี้ย)',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                            
                                label += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(context.parsed.y);
                            }
                            return label;
                        },
                    
                        afterLabel: function(context) {
                          
                             const yearIndex = context.dataIndex;
                             if (yearIndex >= 0 && yearIndex < yearly_total.length) {
                                 const totalAmount = yearly_total[yearIndex];
                                 return '\nยอดรวม: ' + new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(totalAmount);
                             }
                             return '';
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}
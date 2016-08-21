'use strict';

angular.module('paymentProcessor')
  .service('chartBuilder', chartBuilder);

function chartBuilder () {
	const service = this;

	/** Service Variables **/

	/** Service Functions **/
  service.buildHorizontalBarGraph = _buildHorizontalBarGraph;
  service.buildIncomeDonutGraph = _buildIncomeDonutGraph;
  service.buildExpenditureDonutGraph = _buildExpenditureDonutGraph;


	/****** Implementation ******/

  function _buildHorizontalBarGraph (receivedIncomesAmount, paidExpendituresAmount) {

    return {
        options: {
            chart: {
                type: 'bar'
            }
        },
        xAxis: {
          categories: ['CASH IN', 'CASH OUT'],
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          tickLength: 0,
          lineColor: 'transparent',
          title: null,
          labels: {
            align: 'left',
            x: 0,
            y: -20,
            style: {'fontFamily': 'khuluBold', 'fontSize': "20px", "color": "rgb(85, 85, 85)"}
          }
        },
        yAxis: {
          gridLineWidth: 0,
          minorGridLineWidth: 0,
          tickLength: 0,
          lineColor: 'transparent',
          title: null,
          labels: {
            enabled: false
          }
        },
        series: [{
            colorByPoint: true,
            pointWidth: 21,
            showInLegend: false,
            pointPadding: 0,
            groupPadding: 0.1,
            data: [
              {
                y: receivedIncomesAmount,
                color: 'rgb(46, 204, 113)'
              }, {
                y: paidExpendituresAmount,
                color: 'rgb(41, 128, 185)'
              }
            ]
        }],
        title: {
          text: null
        },
        size: {
          width: 385,
          height: 155
        },
        loading: false
    };
  }

  function _buildIncomeDonutGraph (receivedIncomesAmount, owedIncomesAmount) {

    return {
      options: {
        chart: {
          type: 'pie',
          marginBottom: 50
        }
      },
      size: {
        width: 200,
        height: 250
      },
      title: {
        text: 'INCOME',
        verticalAlign: 'bottom',
        y: 0,
        style: {'fontFamily': 'khuluBold', 'fontSize': "22px", "color": "rgb(85, 85, 85);"}
      },
      plotOptions: {
        pie: {
          shadow: false
        }
      },
      series: [{
        name: 'Cash Flow',
        data: [
          {
            name: "Cash In",
            y: receivedIncomesAmount,
            color: 'rgb(46, 204, 113)'
          }, {
            name: "Cash Out",
            y: owedIncomesAmount,
            color: 'rgb(231, 76, 60)'
          }
        ],
        size: '110%',
        innerSize: '67%',
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    };
  }
  function _buildExpenditureDonutGraph (paidExpendituresAmount, unpaidExpendituresAmount) {

    return {
      options: {
        chart: {
          type: 'pie',
          marginBottom: 50
        }
      },
      size: {
        width: 200,
        height: 250
      },
      title: {
        text: 'EXPENDITURES',
        verticalAlign: 'bottom',
        y: 0,
        style: {'fontFamily': 'khuluBold', 'fontSize': "22px", "color": "rgb(85, 85, 85)"}
      },
      plotOptions: {
        pie: {
          shadow: false
        }
      },
      series: [{
        name: 'Browsers',
        data: [
          {
            name: "Cash In",
            y: paidExpendituresAmount,
            color: 'rgb(41, 128, 185)'
          }, {
            name: "Cash Out",
            y: unpaidExpendituresAmount,
            color: 'rgb(242, 155, 18)'}
        ],
        size: '110%',
        innerSize: '67%',
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    };
  }
}

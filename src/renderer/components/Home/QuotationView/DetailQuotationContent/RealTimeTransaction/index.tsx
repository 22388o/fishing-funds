import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface RealTimeTransactionProps {
  code: string;
}

const RealTimeTransaction: React.FC<RealTimeTransactionProps> = ({ code = '' }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result = {}, run: runGetTransactionFromEasymoney } = useRequest(
    () => Services.Quotation.GetTransactionFromEasymoney(code),
    {
      pollingInterval: 1000 * 60,
      refreshDeps: [code],
      ready: !!chartInstance,
    }
  );
  useRenderEcharts(
    ({ varibleColors, darkMode }) => {
      chartInstance?.setOption({
        backgroundColor: 'transparent',
        title: {
          show: false,
        },
        grid: {
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '交易金额(亿)',
            type: 'pie',
            radius: '64%',
            center: ['50%', '50%'],
            data: [
              {
                name: '超大单流入',
                value: result.cddlr,
                itemStyle: {
                  color: darkMode ? '#431418' : '#820014',
                },
              },
              {
                name: '大单流入',
                value: result.ddlr,
                itemStyle: {
                  color: darkMode ? '#791a1f' : '#cf1322',
                },
              },
              {
                name: '中单流入',
                value: result.zdlr,
                itemStyle: {
                  color: darkMode ? '#d32029' : '#ff4d4f',
                },
              },
              {
                name: '小单流入',
                value: result.xdlr,
                itemStyle: {
                  color: darkMode ? '#f37370' : '#ffa39e',
                },
              },
              {
                name: '小单流出',
                value: result.xdlc,
                itemStyle: {
                  color: darkMode ? '#8fd460' : '#b7eb8f',
                },
              },
              {
                name: '中单流出',
                value: result.zdlc,
                itemStyle: {
                  color: darkMode ? '#49aa19' : '#73d13d',
                },
              },
              {
                name: '大单流出',
                value: result.ddlc,
                itemStyle: {
                  color: darkMode ? '#306317' : '#389e0d',
                },
              },
              {
                name: '超大单流出',
                value: result.cddlc,
                itemStyle: {
                  color: darkMode ? '#1d3712' : '#135200',
                },
              },
            ],
            label: {
              color: varibleColors['--main-text-color'],
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: () => Math.random() * 200,
            itemStyle: {
              borderRadius: 10,
            },
          },
        ],
      });
    },
    chartInstance,
    [result]
  );

  return (
    <ChartCard auto onFresh={runGetTransactionFromEasymoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
    </ChartCard>
  );
};

export default RealTimeTransaction;

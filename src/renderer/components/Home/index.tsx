import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';
import { Tabs } from 'antd';

import FundView from '@/components/Home/FundView';
import ZindexView from '@/components/Home/ZindexView';
import QuotationView from '@/components/Home/QuotationView';
import StockView from '@/components/Home/StockView';
import CoinView from '@/components/Home/CoinView';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import GlobalStyles from '@/components/GlobalStyles';
import WebViewer from '@/components/WebViewer';
import { stockTypesConfig } from '@/components/Toolbar/AppCenterContent/StockSearch';

import { useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface HomeProps {}

const FundGroup = () => {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Funds}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <FundView filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="持有" key={String(1)}>
        <FundView filter={(fund) => !!codeMap[fund.fundcode!]?.cyfe} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="自选" key={String(2)}>
        <FundView filter={(fund) => !codeMap[fund.fundcode!]?.cyfe} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="净值更新" key={String(3)}>
        <FundView filter={(fund) => !!Helpers.Fund.CalcFund(fund, codeMap).isFix} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const ZindexGroup = () => {
  // const { codeMap: zindexCodeMap } = useAppSelector((state) => state.zindex.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Zindex}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <ZindexView filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="上涨" key={String(1)}>
        <ZindexView filter={(zindex) => zindex.zdd >= 0} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="下跌" key={String(2)}>
        <ZindexView filter={(zindex) => zindex.zdd < 0} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const QuotationGroup = () => {
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Quotation}>
      <Tabs.TabPane tab="行业" key={String(0)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Industry} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="概念" key={String(1)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Concept} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="地域" key={String(2)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Area} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="关注" key={String(3)}>
        <QuotationView filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const StockGroup = () => {
  const { codeMap: stockCodeMap } = useAppSelector((state) => state.stock.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Stock}>
      <Tabs.TabPane tab="全部" key={String(-1)}>
        <StockView filter={() => true} />
      </Tabs.TabPane>
      {stockTypesConfig.map((type) => (
        <Tabs.TabPane tab={type.name.slice(0, 2)} key={String(type.code)}>
          <StockView filter={(stock) => stockCodeMap[stock.secid].type === type.code} />
        </Tabs.TabPane>
      ))}
    </GroupTab>
  );
};

const CoinGroup = () => {
  return (
    <GroupTab tabKey={Enums.TabKeyType.Coin}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <CoinView filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="上涨" key={String(1)}>
        <CoinView filter={(coin) => Number(coin.change24h) >= 0} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="下跌" key={String(2)}>
        <CoinView filter={(coin) => Number(coin.change24h) < 0} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const Body = () => {
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);

  return (
    <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={{ tabPane: true, inkBar: false }} destroyInactiveTabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Funds)}>
        <FundGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Zindex)}>
        <ZindexGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Quotation)}>
        <QuotationGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Stock)}>
        <StockGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Coin)}>
        <CoinGroup />
      </Tabs.TabPane>
    </Tabs>
  );
};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={clsx(styles.layout)}>
      <GlobalStyles />
      <Header>
        <Wallet />
        <SortBar />
      </Header>
      <Body />
      <Footer>
        <Toolbar />
        <TabsBar />
      </Footer>
      <WebViewer />
      <Collect title="home" />
    </div>
  );
};

export default Home;
